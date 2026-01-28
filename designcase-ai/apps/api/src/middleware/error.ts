import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorHandler(
  error: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status =
    error instanceof ApiError ? error.status : 500;
  const message = error.message || 'Internal server error';

  console.error(`[${status}] ${message}`, error);

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
}
