import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AdminUser } from '../types';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // Fail loudly rather than silently signing tokens with a guessable default.
  // Set JWT_SECRET in your .env file (see .env.example) before starting the server.
  throw new Error(
    'JWT_SECRET is not set. Copy .env.example to .env and set a long, random JWT_SECRET before starting the server.'
  );
}

const TOKEN_TTL = '2h';

export function signAdminToken(user: AdminUser): string {
  return jwt.sign({ sub: user.id, username: user.username, email: user.email }, JWT_SECRET as string, {
    expiresIn: TOKEN_TTL
  });
}

export interface AuthedRequest extends Request {
  admin?: { id: number; username: string; email: string };
}

/**
 * Express middleware that requires a valid `Authorization: Bearer <token>` header
 * signed with JWT_SECRET. Rejects the request with 401 if missing/invalid/expired.
 */
export function requireAdminAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as unknown as { sub: number; username: string; email: string };
    req.admin = { id: payload.sub, username: payload.username, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
