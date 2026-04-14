import { Todo } from '../models/Todo';

export interface SortStrategy {
    sort(todos: Todo[]): Todo[];
}

export class SortByDateStrategy implements SortStrategy {
    sort(todos: Todo[]): Todo[] {
        return [...todos].sort((a, b) => {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.getTime() - b.dueDate.getTime();
        });
    }
}

export class SortByPriorityStrategy implements SortStrategy {
    private priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

    sort(todos: Todo[]): Todo[] {
        return [...todos].sort((a, b) => {
            return this.priorityOrder[a.getPriority()] - this.priorityOrder[b.getPriority()];
        });
    }
}

export class SortByCreatedStrategy implements SortStrategy {
    sort(todos: Todo[]): Todo[] {
        return [...todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
}
