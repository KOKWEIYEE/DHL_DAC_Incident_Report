import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const normalizedStoredHash = storedHash.trim();

  if (normalizedStoredHash.startsWith('$2a$') || normalizedStoredHash.startsWith('$2b$') || normalizedStoredHash.startsWith('$2y$')) {
    return bcrypt.compare(password, normalizedStoredHash);
  }

  const sha256Hash = createHash('sha256').update(password).digest('hex');
  return sha256Hash.toLowerCase() === normalizedStoredHash.toLowerCase();
}
