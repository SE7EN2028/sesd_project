import { BaseRepository } from './BaseRepository';
import { SubTask } from '../models/SubTask';

class SubTaskRepository extends BaseRepository<SubTask> {
    async findByTodo(todoId: number): Promise<SubTask[]> {
        return Array.from(this.data.values()).filter(s => s.todoId === todoId);
    }

    async countByTodo(todoId: number): Promise<{ total: number; completed: number }> {
        const items = await this.findByTodo(todoId);
        return {
            total: items.length,
            completed: items.filter(s => s.completed).length,
        };
    }

    async deleteByTodo(todoId: number): Promise<number> {
        const items = await this.findByTodo(todoId);
        items.forEach(s => this.data.delete(s.id));
        return items.length;
    }
}

export default new SubTaskRepository();
