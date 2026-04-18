import { Request, Response, NextFunction } from 'express';
import subTaskService from '../services/SubTaskService';

class SubTaskController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await subTaskService.create(Number(req.params.todoId), req.body.title);
            res.status(201).json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async getByTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await subTaskService.findByTodo(Number(req.params.todoId));
            res.json({ status: 'success', results: data.length, data });
        } catch (err) {
            next(err);
        }
    }

    async toggle(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await subTaskService.toggle(Number(req.params.id));
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await subTaskService.update(Number(req.params.id), req.body.title);
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await subTaskService.delete(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async getProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await subTaskService.getProgress(Number(req.params.todoId));
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }
}

export default new SubTaskController();
