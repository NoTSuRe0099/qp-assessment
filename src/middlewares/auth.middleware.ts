import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { userRoles } from '../models/user.model';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const access_token: string | undefined | null =
      req?.cookies?.['access_token'] || null;
    if (!access_token) {
      return res
        .status(401)
        .cookie('access_token', null)
        .json({ message: 'No token provided' });
    }

    const isVerified: any = jwt.verify(
      access_token,
      process.env.JWT_SECRET || ''
    );
    if (!isVerified) {
      return res
        .status(401)
        .cookie('access_token', null)
        .json({ message: 'Unauthenticated' });
    }
    const decoded: any = jwt.decode(access_token);
    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error: any) {
    console.log('auth middleware err:', error.name, error.message);

    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .cookie('access_token', null)
        .json({ message: 'Token expired' });
    } else if (error instanceof JsonWebTokenError) {
      return res
        .status(401)
        .cookie('access_token', null)
        .json({ message: 'Invalid token' });
    }

    return res
      .status(401)
      .cookie('access_token', null)
      .json({ message: 'Something went wrong' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req?.role !== userRoles?.admin) {
    return res
      .status(401)
      .cookie('access_token', null)
      .json({ message: 'Unauthorized' });
  }

  next();
};
