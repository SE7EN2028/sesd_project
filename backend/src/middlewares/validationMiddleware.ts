import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

const validTypes = ['personal', 'work', 'urgent'];

export function validateTodoCreate(req: Request, res: Response, next: NextFunction) {
    const { title, type } = req.body;
    const errors: string[] = [];

    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.push('Title is required');
    }
    if (type && !validTypes.includes(type)) {
        errors.push(`Type must be one of: ${validTypes.join(', ')}`);
    }

    if (errors.length > 0) {
        return next(new AppError(errors.join('. '), 400));
    }
    next();
}

export function validateTodoUpdate(req: Request, res: Response, next: NextFunction) {
    const { title } = req.body;
    const errors: string[] = [];

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        errors.push('Title must be a non-empty string');
    }
    if (Object.keys(req.body).length === 0) {
        errors.push('At least one field is required');
    }

    if (errors.length > 0) {
        return next(new AppError(errors.join('. '), 400));
    }
    next();
}
