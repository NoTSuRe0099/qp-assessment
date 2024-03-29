import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
  expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax',
  // domain: 'localhost', // Use the custom domain for testing
};
