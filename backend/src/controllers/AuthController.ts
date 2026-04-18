import { Request, Response, NextFunction } from 'express';
import authService from '../services/AuthService';
import { AuthRequest } from '../middlewares/authMiddleware';

class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            const data = await authService.register({ name, email, password });
            res.status(201).json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const data = await authService.login(email, password);
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async me(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await authService.getUserById(req.userId!);
            res.json({ status: 'success', data: user });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
