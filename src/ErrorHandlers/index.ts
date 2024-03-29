import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export class CustomError extends Error {
  errorCode: number;

  constructor(message = 'Internal Server Error', errorCode = 500) {
    super();
    this.message = message;
    this.errorCode = errorCode;
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res
      .status(err.errorCode)
      .json({ success: false, error: err, message: err?.message });
  }
  console.error('Internal Server Error ====>', err);
  res.status(500).json({
    success: false,
    error: err,
    message: 'Internal server error',
    data: null,
  });
};

export const asyncErrorHandler = (
  func: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>>>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((err) => next(err));
  };
};

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: 'Invalid data',
          details: errorMessages,
          data: null,
        });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ success: false, error: 'Internal Server Error', data: null });
      }
    }
  };
}
