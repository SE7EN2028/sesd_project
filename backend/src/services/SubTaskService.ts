import subTaskRepository from '../repositries/SubTaskRepository';
import todoRepository from '../repositries/TodoRepository';
import { SubTask } from '../models/SubTask';
import { AppError } from '../utils/AppError';
import { EventManager } from '../observers/EventManager';

class SubTaskService {
    private eventManager = EventManager.getInstance();

    async create(todoId: number, title: string): Promise<Record<string, unknown>> {
        const todo = await todoRepository.findById(todoId);
        if (!todo) throw new AppError('Todo not found', 404);

        const id = subTaskRepository.getNextId();
        const subtask = new SubTask(id, { todoId, title, completed: false });
        await subTaskRepository.save(subtask);
        this.eventManager.emit('subtask:created', { title, todoTitle: todo.title });
        return subtask.toJSON();
    }

    async findByTodo(todoId: number): Promise<Record<string, unknown>[]> {
        const items = await subTaskRepository.findByTodo(todoId);
        return items.map(s => s.toJSON());
    }

    async toggle(id: number): Promise<Record<string, unknown>> {
        const subtask = await subTaskRepository.findById(id);
        if (!subtask) throw new AppError('Subtask not found', 404);

        const updated = await subTaskRepository.update(id, (s) => {
            s.toggle();
        });

        this.eventManager.emit(updated!.completed ? 'subtask:completed' : 'subtask:reopened', { title: updated!.title });
        return updated!.toJSON();
    }

    async update(id: number, title: string): Promise<Record<string, unknown>> {
        const updated = await subTaskRepository.update(id, (s) => {
            s.title = title;
        });
        if (!updated) throw new AppError('Subtask not found', 404);
        return updated.toJSON();
    }

    async delete(id: number): Promise<boolean> {
        const subtask = await subTaskRepository.findById(id);
        if (!subtask) throw new AppError('Subtask not found', 404);
        this.eventManager.emit('subtask:deleted', { title: subtask.title });
        return subTaskRepository.delete(id);
    }

    async getProgress(todoId: number): Promise<{ total: number; completed: number; percent: number }> {
        const { total, completed } = await subTaskRepository.countByTodo(todoId);
        return { total, completed, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
    }
}

export default new SubTaskService();
