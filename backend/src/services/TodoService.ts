import todoRepository from '../repositries/TodoRepository';
import { AppError } from '../utils/AppError';
import { TodoType } from '../models/Todo';
import { TodoFactory } from '../factories/TodoFactory';
import { SortStrategy } from '../strategies/SortStrategy';
import { EventManager } from '../observers/EventManager';

class TodoService {
    private factory = TodoFactory.getInstance();
    private eventManager = EventManager.getInstance();

    async create(data: any): Promise<Record<string, unknown>> {
        const type: TodoType = data.type || 'personal';
        const id = todoRepository.getNextId();
        const todo = this.factory.createTodo(id, type, {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        });

        await todoRepository.save(todo);
        this.eventManager.emit('todo:created', { title: todo.title, type: todo.type });
        return todo.toJSON();
    }

    async findAll(query: any = {}): Promise<Record<string, unknown>[]> {
        let todos;

        if (query.search) {
            todos = await todoRepository.search(query.search);
        } else if (query.type) {
            todos = await todoRepository.findByType(query.type);
        } else if (query.completed === 'true') {
            todos = await todoRepository.findCompleted();
        } else if (query.completed === 'false') {
            todos = await todoRepository.findPending();
        } else if (query.categoryId) {
            todos = await todoRepository.findByCategory(Number(query.categoryId));
        } else {
            todos = await todoRepository.findAll();
        }

        return todos.map(t => t.toJSON());
    }

    async findAllSorted(strategy: SortStrategy, query: any = {}): Promise<Record<string, unknown>[]> {
        let todos;

        if (query.search) {
            todos = await todoRepository.search(query.search);
        } else if (query.type) {
            todos = await todoRepository.findByType(query.type);
        } else {
            todos = await todoRepository.findAll();
        }

        const sorted = strategy.sort(todos);
        return sorted.map(t => t.toJSON());
    }

    async findById(id: number): Promise<Record<string, unknown>> {
        const todo = await todoRepository.findById(id);
        if (!todo) throw new AppError('Todo not found', 404);
        return todo.toJSON();
    }

    async update(id: number, data: any): Promise<Record<string, unknown>> {
        const updated = await todoRepository.update(id, (todo) => {
            if (data.title !== undefined) todo.title = data.title;
            if (data.description !== undefined) todo.description = data.description;
            if (data.completed !== undefined) todo.completed = data.completed;
            if (data.dueDate !== undefined) todo.dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
            if (data.categoryId !== undefined) todo.categoryId = data.categoryId;
        });
        if (!updated) throw new AppError('Todo not found', 404);
        this.eventManager.emit('todo:updated', { title: updated.title });
        return updated.toJSON();
    }

    async toggleComplete(id: number): Promise<Record<string, unknown>> {
        const todo = await todoRepository.findById(id);
        if (!todo) throw new AppError('Todo not found', 404);

        const updated = await todoRepository.update(id, (t) => {
            t.completed = !t.completed;
        });

        this.eventManager.emit(updated!.completed ? 'todo:completed' : 'todo:reopened', { title: updated!.title });
        return updated!.toJSON();
    }

    async delete(id: number): Promise<boolean> {
        const todo = await todoRepository.findById(id);
        if (!todo) throw new AppError('Todo not found', 404);
        const title = todo.title;
        const result = await todoRepository.delete(id);
        this.eventManager.emit('todo:deleted', { title });
        return result;
    }

    async getStats(): Promise<Record<string, unknown>> {
        const all = await todoRepository.findAll();
        const completed = all.filter(t => t.completed).length;
        const pending = all.length - completed;
        const overdue = (await todoRepository.findOverdue()).length;
        const dueToday = (await todoRepository.findDueToday()).length;
        const byType: Record<string, number> = {};
        const byPriority: Record<string, number> = {};

        all.forEach(t => {
            byType[t.type] = (byType[t.type] || 0) + 1;
            byPriority[t.getPriority()] = (byPriority[t.getPriority()] || 0) + 1;
        });

        return { total: all.length, completed, pending, overdue, dueToday, byType, byPriority };
    }
}

export default new TodoService();
