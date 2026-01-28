import { Request, Response, NextFunction } from 'express';

export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const start = Date.now();

  const originalJson = _res.json;
  _res.json = function (body) {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${_res.statusCode} (${duration}ms)`
    );
    return originalJson.call(this, body);
  };

  next();
}
