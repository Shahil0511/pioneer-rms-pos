import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = `🔍 Route not found: ${req.method} ${req.originalUrl}`;

  console.warn(message);

  res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: "Resource not found",
      method: req.method,
      path: req.originalUrl,
    },
  });
};
