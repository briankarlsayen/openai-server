import { Request, Response, NextFunction } from 'express';

export class ErrorResponse extends Error {
  statusCode: number;
  constructor(message: any, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = { ...err };

  error.message = err.message;

  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new ErrorResponse(message, 400);
  }

  if (
    err.code === 'ERR_BAD_REQUEST' &&
    error?.response?.data?.errors[0]?.code === 'PUSH_TOO_MANY_EXPERIENCE_IDS'
  ) {
    console.log('push notif err', error?.response?.data?.errors[0]);
    error = new ErrorResponse(error.response.data.errors[0].message, 400);
  }

  console.log(error.message);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

// module.exports = { errorHandler, ErrorResponse };
