import { Request, Response, NextFunction } from 'express';
import authService from '../services/AuthService';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
    userId?: number;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return next(new AppError('No token provided', 401));
    }

    const token = header.split(' ')[1];

    try {
        const { userId } = authService.verifyToken(token);
        req.userId = userId;
        next();
    } catch (err) {
        next(err);
    }
}
