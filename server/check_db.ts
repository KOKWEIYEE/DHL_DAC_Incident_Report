
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'dhldac_incident_report',
  });

  try {
    const [users] = await connection.query('SELECT * FROM users');
    console.log('Users:', users);
    const [roles] = await connection.query('SELECT * FROM roles');
    console.log('Roles:', roles);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

check();
