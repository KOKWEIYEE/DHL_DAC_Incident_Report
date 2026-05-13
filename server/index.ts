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
    `SELECT u.id, u.username, u.password_hash, u.full_name, u.role_id, r.role_name, u.created_at
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     ORDER BY u.id ASC`
  );

  res.json({
    users: rows.map(({ password_hash: _passwordHash, ...user }) => ({
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      roleId: user.role_id,
      roleName: user.role_name,
      createdAt: user.created_at,
    })),
  });
});

app.post('/api/users', async (req, res) => {
  const { username, password, fullName, roleName = 'user' } = req.body as {
    username?: string;
    password?: string;
    fullName?: string;
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
    'INSERT INTO users (username, password_hash, full_name, role_id) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, fullName, roleId]
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

  const { username, password, fullName, roleName } = req.body as {
    username?: string;
    password?: string;
    fullName?: string;
    roleName?: string;
  };

  const [existingRows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]);
  if (existingRows.length === 0) {
    res.status(404).json({ message: 'User not found.' });
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

  const [users] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE username = ? LIMIT 1', ['admin']);
  if (users.length === 0) {
    const defaultPasswordHash = createHash('sha256').update('Admin@12345').digest('hex');
    await pool.execute(
      'INSERT INTO users (username, password_hash, full_name, role_id) VALUES (?, ?, ?, ?)',
      ['admin', defaultPasswordHash, 'System Administrator', adminRoleId]
    );
  }
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

async function startServer() {
  try {
    await ensureDatabase();
    await ensureTables();
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