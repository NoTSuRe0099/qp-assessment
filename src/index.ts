import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import http from 'http';
import { NotFoundError, errorHandler } from './ErrorHandlers';
import connectDB from './config/mongoDB.service';
import groceryRoutes from './routes/grocery.routes';
import authRoutes from './routes/user.routes';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app: Application = express();
const server: http.Server = http.createServer(app);
const port: number = parseInt(process.env.PORT || '5000', 10);

app.use(express.json());
// Middleware
app.use(
  cors({
    origin: ['http://localhost:4000', 'http://192.168.203.107:4000'],
    credentials: true,
  })
);
app.use(cookieParser());

connectDB();

// Sample route for testing
app.get('/', (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Hello There 🙋‍♂️',
  });
});

// Routes
app.use('/grocery', groceryRoutes);
app.use('/auth', authRoutes);
app.use('/order', orderRoutes);

//? <------- Error handling middlewares ------->
//* 404 Erorr handling and Middleware to ignore favicon.ico requests -->
app.use((req, res, next) => {
  if (req.url === '/favicon.ico') {
    return next();
  }

  console.log('404 Error URL ===>', req?.url);
  throw new NotFoundError();
});

//* custom error handling -->
app.use(errorHandler);

//* errors & logs -->
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500);
  res.json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

declare module 'express' {
  interface Request {
    userId?: string;
    role?: string;
    // Add other custom properties if needed
  }
}

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
