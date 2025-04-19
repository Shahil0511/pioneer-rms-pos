// src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import logger from "../lib/logger";

export const validate = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        logger.warn("Validation error:", {
          errors,
          body: req.body,
          path: req.path,
        });

        res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors,
        });
        return;
      }
      next(error);
    }
  };
};
