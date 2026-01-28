import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error.js';

export function validateAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Missing or invalid authorization header');
  }

  // TODO: Verify JWT token with Supabase
  // const token = authHeader.substring(7);

  next();
}
