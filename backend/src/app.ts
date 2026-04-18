import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { AppError } from './utils/AppError';
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes';
import categoryRoutes from './routes/categoryRoutes';
import { authenticate } from './middlewares/authMiddleware';

const app = express();

app.use(cors());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/todos', authenticate, todoRoutes);
app.use('/api/v1/categories', authenticate, categoryRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Not Found - ${req.originalUrl}`, 404));
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        status: err.status || 'error',
        message: err.message,
    });
});

export default app;
