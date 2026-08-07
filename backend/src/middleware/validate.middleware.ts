import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../domain/exceptions/AppError';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => `${issue.path.join('.')} is ${issue.message}`);
        next(new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400, 'VALIDATION_ERROR'));
      } else {
        next(error);
      }
    }
  };
};
