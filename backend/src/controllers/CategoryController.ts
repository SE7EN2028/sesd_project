import { Request, Response, NextFunction } from 'express';
import categoryService from '../services/CategoryService';

class CategoryController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await categoryService.create(req.body);
            res.status(201).json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await categoryService.findAll();
            res.json({ status: 'success', results: data.length, data });
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await categoryService.findById(Number(req.params.id));
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await categoryService.update(Number(req.params.id), req.body);
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await categoryService.delete(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}

export default new CategoryController();
