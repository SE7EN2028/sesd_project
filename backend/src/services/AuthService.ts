import jwt from 'jsonwebtoken';
import userRepository from '../repositries/UserRepository';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'todo-app-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

class AuthService {
    async register(data: { name: string; email: string; password: string }): Promise<{ user: Record<string, unknown>; token: string }> {
        const existing = await userRepository.findByEmail(data.email);
        if (existing) throw new AppError('Email already registered', 400);

        if (!data.password || data.password.length < 6) {
            throw new AppError('Password must be at least 6 characters', 400);
        }

        const passwordHash = await User.hashPassword(data.password);
        const id = userRepository.getNextId();
        const user = new User(id, {
            name: data.name,
            email: data.email,
            password: data.password,
            passwordHash,
        });

        await userRepository.save(user);
        const token = this.generateToken(user.id);

        return { user: user.toJSON(), token };
    }

    async login(email: string, password: string): Promise<{ user: Record<string, unknown>; token: string }> {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new AppError('Invalid email or password', 401);

        const valid = await user.comparePassword(password);
        if (!valid) throw new AppError('Invalid email or password', 401);

        const token = this.generateToken(user.id);
        return { user: user.toJSON(), token };
    }

    async getUserById(id: number): Promise<Record<string, unknown>> {
        const user = await userRepository.findById(id);
        if (!user) throw new AppError('User not found', 404);
        return user.toJSON();
    }

    verifyToken(token: string): { userId: number } {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
            return decoded;
        } catch {
            throw new AppError('Invalid or expired token', 401);
        }
    }

    private generateToken(userId: number): string {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }
}

export default new AuthService();
