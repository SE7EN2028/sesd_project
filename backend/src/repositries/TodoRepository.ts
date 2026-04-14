import { BaseRepository } from './BaseRepository';
import { Todo } from '../models/Todo';

class TodoRepository extends BaseRepository<Todo> {
    async findByCategory(categoryId: number): Promise<Todo[]> {
        return Array.from(this.data.values()).filter(t => t.categoryId === categoryId);
    }

    async findByType(type: string): Promise<Todo[]> {
        return Array.from(this.data.values()).filter(t => t.type === type);
    }

    async findCompleted(): Promise<Todo[]> {
        return Array.from(this.data.values()).filter(t => t.completed);
    }

    async findPending(): Promise<Todo[]> {
        return Array.from(this.data.values()).filter(t => !t.completed);
    }
}

export default new TodoRepository();
