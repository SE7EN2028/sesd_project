import { Request, Response, NextFunction } from 'express';
import todoService from '../services/TodoService';
import todoRepository from '../repositries/TodoRepository';
import { SortByDateStrategy, SortByPriorityStrategy, SortByCreatedStrategy } from '../strategies/SortStrategy';
import { JsonExporter, CsvExporter } from '../templates/TodoExporter';
import { FullDecorator } from '../decorators/TodoDecorator';

class TodoController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await todoService.create(req.body);
            res.status(201).json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            let data;

            if (req.query.sort) {
                let strategy;
                switch (req.query.sort) {
                    case 'date':
                        strategy = new SortByDateStrategy();
                        break;
                    case 'priority':
                        strategy = new SortByPriorityStrategy();
                        break;
                    default:
                        strategy = new SortByCreatedStrategy();
                }
                data = await todoService.findAllSorted(strategy, req.query);
            } else {
                data = await todoService.findAll(req.query);
            }

            res.json({ status: 'success', results: data.length, data });
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await todoService.findById(Number(req.params.id));
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async getOneDecorated(req: Request, res: Response, next: NextFunction) {
        try {
            const todo = await todoRepository.findById(Number(req.params.id));
            if (!todo) { res.status(404).json({ status: 'fail', message: 'Todo not found' }); return; }
            const decorated = new FullDecorator(todo).decorate();
            res.json({ status: 'success', data: decorated });
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await todoService.update(Number(req.params.id), req.body);
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async toggle(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await todoService.toggleComplete(Number(req.params.id));
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await todoService.delete(Number(req.params.id));
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await todoService.getStats();
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }

    async exportTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const format = req.query.format as string || 'json';
            const todos = await todoRepository.findAll();

            const exporter = format === 'csv' ? new CsvExporter() : new JsonExporter();
            const content = exporter.export(todos);

            res.setHeader('Content-Type', exporter.getContentType());
            res.setHeader('Content-Disposition', `attachment; filename=todos.${exporter.getFileExtension()}`);
            res.send(content);
        } catch (err) {
            next(err);
        }
    }
}

export default new TodoController();
