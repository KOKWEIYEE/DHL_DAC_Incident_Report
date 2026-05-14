import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createHash } from 'crypto';
import { RowDataPacket } from 'mysql2';
import mysql from 'mysql2/promise';
import { pool } from './db';
import { hashPassword, verifyPassword } from './password';

dotenv.config();

type UserRow = RowDataPacket & {
  id: number;
  username: string;
  password_hash: string;
  full_name: string;
  department: string | null;
  role_id: number;
  role_name: string;
  created_at: Date;
};

const app = express();
const port = Number(process.env.API_PORT ?? 4000);
const dbName = process.env.DB_NAME ?? 'dhldac_incident_report';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/users', async (_req, res) => {
  const [rows] = await pool.query<UserRow[]>(
    `SELECT u.id, u.username, u.password_hash, u.full_name, u.department, u.role_id, r.role_name, u.created_at
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     ORDER BY u.id ASC`
  );

  res.json({
    users: rows.map(({ password_hash: _passwordHash, ...user }) => ({
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      department: user.department ?? 'Unassigned',
      roleId: user.role_id,
      roleName: user.role_name,
      createdAt: user.created_at,
    })),
  });
});

app.post('/api/users', async (req, res) => {
  const { username, password, fullName, department, roleName = 'user' } = req.body as {
    username?: string;
    password?: string;
    fullName?: string;
    department?: string;
    roleName?: string;
  };

  if (!username || !password || !fullName) {
    res.status(400).json({ message: 'username, password, and fullName are required.' });
    return;
  }

  const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE username = ? LIMIT 1', [username]);
  if (existing.length > 0) {
    res.status(409).json({ message: 'A user with that username already exists.' });
    return;
  }

  const hashedPassword = await hashPassword(password);
  const [roleResult] = await pool.execute(
    'INSERT INTO roles (role_name) VALUES (?) ON DUPLICATE KEY UPDATE role_name = VALUES(role_name)',
    [roleName]
  );
  void roleResult;

  const [roleRows] = await pool.query<RowDataPacket[]>('SELECT id FROM roles WHERE role_name = ? LIMIT 1', [roleName]);
  const roleId = roleRows[0]?.id;

  if (!roleId) {
    res.status(500).json({ message: 'Unable to resolve role.' });
    return;
  }

  const [result] = await pool.execute(
    'INSERT INTO users (username, password_hash, full_name, department, role_id) VALUES (?, ?, ?, ?, ?)',
    [username, hashedPassword, fullName, department ?? null, roleId]
  );

  res.status(201).json({
    message: 'User created successfully.',
    userId: (result as { insertId: number }).insertId,
  });
});

app.patch('/api/users/:id', async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) {
    res.status(400).json({ message: 'Invalid user id.' });
    return;
  }

  const { username, password, fullName, department, roleName } = req.body as {
    username?: string;
    password?: string;
    fullName?: string;
    department?: string;
    roleName?: string;
  };

  const [existingRows] = await pool.query<RowDataPacket[]>('SELECT id, username FROM users WHERE id = ? LIMIT 1', [userId]);
  if (existingRows.length === 0) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  if ((existingRows[0] as { username?: string }).username === 'admin') {
    res.status(403).json({ message: 'The admin account cannot be modified.' });
    return;
  }

  const updates: string[] = [];
  const values: Array<string | number> = [];

  if (username) {
    updates.push('username = ?');
    values.push(username);
  }

  if (password) {
    updates.push('password_hash = ?');
    values.push(await hashPassword(password));
  }

  if (fullName) {
    updates.push('full_name = ?');
    values.push(fullName);
  }

  if (department) {
    updates.push('department = ?');
    values.push(department);
  }

  if (roleName) {
    await pool.execute(
      'INSERT INTO roles (role_name) VALUES (?) ON DUPLICATE KEY UPDATE role_name = VALUES(role_name)',
      [roleName]
    );
    const [roleRows] = await pool.query<RowDataPacket[]>('SELECT id FROM roles WHERE role_name = ? LIMIT 1', [roleName]);
    const roleId = roleRows[0]?.id;
    if (!roleId) {
      res.status(500).json({ message: 'Unable to resolve role.' });
      return;
    }

    updates.push('role_id = ?');
    values.push(roleId);
  }

  if (updates.length === 0) {
    res.status(400).json({ message: 'No update values were provided.' });
    return;
  }

  values.push(userId);
  await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

  res.json({ message: 'User updated successfully.' });
});

app.delete('/api/users/:id', async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) {
    res.status(400).json({ message: 'Invalid user id.' });
    return;
  }

  const [existingRows] = await pool.query<RowDataPacket[]>('SELECT username FROM users WHERE id = ? LIMIT 1', [userId]);
  if (existingRows.length === 0) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  if ((existingRows[0] as { username?: string }).username === 'admin') {
    res.status(403).json({ message: 'The admin account cannot be deleted.' });
    return;
  }

  await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
  res.json({ message: 'User deleted successfully.' });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    res.status(400).json({ message: 'username and password are required.' });
    return;
  }

  const [rows] = await pool.query<UserRow[]>(
    `SELECT u.id, u.username, u.password_hash, u.full_name, u.role_id, r.role_name, u.created_at
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     WHERE u.username = ?
     LIMIT 1`,
    [username]
  );

  const user = rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    res.status(401).json({ message: 'Invalid username or password.' });
    return;
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      roleId: user.role_id,
      roleName: user.role_name,
      createdAt: user.created_at,
    },
  });
});

app.get('/api/tickets', async (_req, res) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT t.*, 
            u1.full_name as requester_name, u1.username as requester_username,
            u2.full_name as assignee_name, u2.username as assignee_username, r2.role_name as assignee_role
     FROM tickets t
     LEFT JOIN users u1 ON t.requester_id = u1.id
     LEFT JOIN users u2 ON t.assignee_id = u2.id
     LEFT JOIN roles r2 ON u2.role_id = r2.id
     ORDER BY t.created_at DESC`
  );

  const tickets = rows.map(t => ({
    id: t.id.toString(),
    subject: t.subject,
    description: t.description,
    status: t.status,
    priority: t.priority,
    type: t.type,
    department: t.department,
    timeCreated: new Date(t.created_at).toLocaleString(),
    lastUpdated: new Date(t.updated_at).toLocaleString(),
    requester: t.requester_name,
    requesterAvatar: `https://i.pravatar.cc/150?u=${t.requester_username}`,
    assignedTo: t.assignee_id ? {
      avatar: `https://i.pravatar.cc/150?u=${t.assignee_username}`,
      name: t.assignee_name,
      email: `${t.assignee_username}@dhl.com`,
      role: t.assignee_role
    } : null,
  }));

  res.json({ tickets });
});

app.get('/api/tickets/:id', async (req, res) => {
  const ticketId = Number(req.params.id);
  if (!Number.isInteger(ticketId)) return res.status(400).json({ message: 'Invalid ticket id.' });

  const [tRows] = await pool.query<RowDataPacket[]>(
    `SELECT t.*, 
            u1.full_name as requester_name, u1.username as requester_username,
            u2.full_name as assignee_name, u2.username as assignee_username, r2.role_name as assignee_role
     FROM tickets t
     LEFT JOIN users u1 ON t.requester_id = u1.id
     LEFT JOIN users u2 ON t.assignee_id = u2.id
     LEFT JOIN roles r2 ON u2.role_id = r2.id
     WHERE t.id = ?`,
     [ticketId]
  );

  if (tRows.length === 0) return res.status(404).json({ message: 'Ticket not found.' });
  const t = tRows[0];

  const [tagsRows] = await pool.query<RowDataPacket[]>('SELECT tag FROM ticket_tags WHERE ticket_id = ?', [ticketId]);
  const tags = tagsRows.map(r => r.tag);

  const [commentsRows] = await pool.query<RowDataPacket[]>(
    `SELECT c.*, u.full_name, u.username 
     FROM ticket_comments c 
     LEFT JOIN users u ON c.author_id = u.id 
     WHERE ticket_id = ? ORDER BY c.created_at ASC`, [ticketId]
  );
  
  const comments = commentsRows.map(c => ({
    id: c.id.toString(),
    author: c.full_name,
    authorEmail: `${c.username}@dhl.com`,
    authorAvatar: '',
    text: c.text,
    timestamp: new Date(c.created_at).toLocaleString(),
    isInternal: Boolean(c.is_internal)
  }));

  const [historyRows] = await pool.query<RowDataPacket[]>(
    `SELECT h.*, u.full_name 
     FROM ticket_history h 
     LEFT JOIN users u ON h.actor_id = u.id 
     WHERE ticket_id = ? ORDER BY h.created_at DESC`, [ticketId]
  );

  const history = historyRows.map(h => ({
    id: h.id.toString(),
    action: h.action,
    actor: h.full_name,
    timestamp: new Date(h.created_at).toLocaleString()
  }));

  res.json({
    ticket: {
      id: t.id.toString(),
      subject: t.subject,
      description: t.description,
      status: t.status,
      priority: t.priority,
      type: t.type,
      department: t.department,
      timeCreated: new Date(t.created_at).toLocaleString(),
      lastUpdated: new Date(t.updated_at).toLocaleString(),
      requester: t.requester_name,
      requesterAvatar: '',
      requesterEmail: `${t.requester_username}@dhl.com`,
      assignedTo: t.assignee_id ? {
        avatar: '',
        name: t.assignee_name,
        email: `${t.assignee_username}@dhl.com`,
        role: t.assignee_role
      } : {
        avatar: '',
        name: 'Unassigned',
        email: '',
        role: ''
      },
      tags,
      comments,
      history
    }
  });
});

app.post('/api/tickets', async (req, res) => {
  const { subject, description, department, requester_id, type = 'Incident', priority = 'Medium', status = 'Draft', tags = [] } = req.body;
  if (!subject || !description || !department || !requester_id) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const [result] = await pool.execute(
    'INSERT INTO tickets (subject, description, department, requester_id, type, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [subject, description, department, requester_id, type, priority, status]
  );
  
  const insertId = (result as { insertId: number }).insertId;

  if (Array.isArray(tags) && tags.length > 0) {
    for (const tag of tags.slice(0, 3)) {
      await pool.execute(
        'INSERT INTO ticket_tags (ticket_id, tag) VALUES (?, ?)',
        [insertId, tag]
      );
    }
  }

  await pool.execute(
    'INSERT INTO ticket_history (ticket_id, actor_id, action) VALUES (?, ?, ?)',
    [insertId, requester_id, 'Ticket created']
  );

  res.status(201).json({ message: 'Ticket created successfully.', ticketId: insertId });
});

app.patch('/api/tickets/:id', async (req, res) => {
  const ticketId = Number(req.params.id);
  const { status, priority, type, tags, assignee_id, history_action, actor_id } = req.body;
  if (!Number.isInteger(ticketId)) return res.status(400).json({ message: 'Invalid ticket id.' });

  const updates: string[] = [];
  const values: any[] = [];
  
  if (status !== undefined) { updates.push('status = ?'); values.push(status); }
  if (priority !== undefined) { updates.push('priority = ?'); values.push(priority); }
  if (type !== undefined) { updates.push('type = ?'); values.push(type); }
  if (assignee_id !== undefined) { updates.push('assignee_id = ?'); values.push(assignee_id); }

  if (updates.length > 0) {
    values.push(ticketId);
    await pool.execute(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`, values);
  }

  if (tags !== undefined && Array.isArray(tags)) {
    await pool.execute('DELETE FROM ticket_tags WHERE ticket_id = ?', [ticketId]);
    for (const tag of tags.slice(0, 3)) {
      await pool.execute('INSERT INTO ticket_tags (ticket_id, tag) VALUES (?, ?)', [ticketId, tag]);
    }
  }

  if (history_action && actor_id) {
    await pool.execute(
      'INSERT INTO ticket_history (ticket_id, actor_id, action) VALUES (?, ?, ?)',
      [ticketId, actor_id, history_action]
    );
  }

  res.json({ message: 'Ticket updated successfully.' });
});

app.post('/api/tickets/:id/comments', async (req, res) => {
  const ticketId = Number(req.params.id);
  const { text, is_internal, author_id } = req.body;
  if (!Number.isInteger(ticketId) || !text || !author_id) {
    return res.status(400).json({ message: 'Invalid input.' });
  }

  await pool.execute(
    'INSERT INTO ticket_comments (ticket_id, author_id, text, is_internal) VALUES (?, ?, ?, ?)',
    [ticketId, author_id, text, is_internal ? 1 : 0]
  );
  
  await pool.execute('UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [ticketId]);

  res.status(201).json({ message: 'Comment added successfully.' });
});

async function seedDefaultAdmin() {
  await pool.execute(
    'INSERT INTO roles (role_name) VALUES (?) ON DUPLICATE KEY UPDATE role_name = VALUES(role_name)',
    ['admin']
  );

  const [roleRows] = await pool.query<RowDataPacket[]>('SELECT id FROM roles WHERE role_name = ? LIMIT 1', ['admin']);
  const adminRoleId = roleRows[0]?.id;
  if (!adminRoleId) {
    throw new Error('Unable to resolve the admin role.');
  }

  const defaultPasswordHash = createHash('sha256').update('Admin@12345').digest('hex');
  await pool.execute(
    `INSERT INTO users (username, password_hash, full_name, department, role_id)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       full_name = VALUES(full_name),
       department = VALUES(department),
       role_id = VALUES(role_id)`,
    ['admin', defaultPasswordHash, 'System Administrator', 'Administration', adminRoleId]
  );
}

async function ensureDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci`
  );
  await connection.end();
}

async function ensureTables() {
  await pool.execute(
    `CREATE TABLE IF NOT EXISTS roles (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      role_name VARCHAR(50) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_roles_role_name (role_name)
    ) ENGINE=InnoDB;`
  );

  await pool.execute(
    `CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      username VARCHAR(100) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      department VARCHAR(150) NULL,
      role_id INT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_users_username (username),
      CONSTRAINT fk_users_role_id
        FOREIGN KEY (role_id) REFERENCES roles (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
    ) ENGINE=InnoDB;`
  );
}

async function ensureDepartmentColumn() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'department'`,
    [dbName]
  );

  const count = Number((rows[0] as { count?: number }).count ?? 0);
  if (count === 0) {
    await pool.execute('ALTER TABLE users ADD COLUMN department VARCHAR(150) NULL');
  }
}

async function ensureTicketsTables() {
  await pool.execute(
    `CREATE TABLE IF NOT EXISTS tickets (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      subject VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(50) NOT NULL,
      priority VARCHAR(50) NOT NULL,
      type VARCHAR(50) NOT NULL,
      department VARCHAR(150) NOT NULL,
      requester_id INT UNSIGNED NOT NULL,
      assignee_id INT UNSIGNED,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_tickets_requester FOREIGN KEY (requester_id) REFERENCES users (id) ON DELETE CASCADE,
      CONSTRAINT fk_tickets_assignee FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE SET NULL
    ) ENGINE=InnoDB;`
  );

  await pool.execute(
    `CREATE TABLE IF NOT EXISTS ticket_tags (
      ticket_id INT UNSIGNED NOT NULL,
      tag VARCHAR(50) NOT NULL,
      PRIMARY KEY (ticket_id, tag),
      CONSTRAINT fk_ticket_tags_ticket FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE
    ) ENGINE=InnoDB;`
  );

  await pool.execute(
    `CREATE TABLE IF NOT EXISTS ticket_comments (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      ticket_id INT UNSIGNED NOT NULL,
      author_id INT UNSIGNED NOT NULL,
      text TEXT NOT NULL,
      is_internal BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_comments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE,
      CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB;`
  );

  await pool.execute(
    `CREATE TABLE IF NOT EXISTS ticket_history (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      ticket_id INT UNSIGNED NOT NULL,
      actor_id INT UNSIGNED NOT NULL,
      action TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_history_ticket FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE,
      CONSTRAINT fk_history_actor FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB;`
  );
}

async function startServer() {
  try {
    await ensureDatabase();
    await ensureTables();
    await ensureDepartmentColumn();
    await ensureTicketsTables();
    await seedDefaultAdmin();

    app.listen(port, () => {
      console.log(`User management API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start API server:', error);
    process.exit(1);
  }
}

void startServer();