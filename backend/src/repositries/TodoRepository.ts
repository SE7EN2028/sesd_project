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

    async search(query: string): Promise<Todo[]> {
        const q = query.toLowerCase();
        return Array.from(this.data.values()).filter(t =>
            t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        );
    }

    async findOverdue(): Promise<Todo[]> {
        const now = new Date();
        return Array.from(this.data.values()).filter(t =>
            !t.completed && t.dueDate && t.dueDate < now
        );
    }

    async findDueToday(): Promise<Todo[]> {
        const today = new Date().toISOString().split('T')[0];
        return Array.from(this.data.values()).filter(t => {
            if (!t.dueDate || t.completed) return false;
            return t.dueDate.toISOString().split('T')[0] === today;
        });
    }
}

export default new TodoRepository();
