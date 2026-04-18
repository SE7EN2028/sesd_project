import { Todo, TodoPriority } from '../models/Todo';

export abstract class TodoDecorator {
    protected todo: Todo;

    constructor(todo: Todo) {
        this.todo = todo;
    }

    abstract decorate(): Record<string, unknown>;
}

export class PriorityLabelDecorator extends TodoDecorator {
    private labels: Record<TodoPriority, string> = {
        high: 'CRITICAL',
        medium: 'NORMAL',
        low: 'LOW PRIORITY',
    };

    private colors: Record<TodoPriority, string> = {
        high: '#ff6b6b',
        medium: '#ffc940',
        low: '#00c9a7',
    };

    decorate(): Record<string, unknown> {
        const json = this.todo.toJSON();
        const priority = this.todo.getPriority();
        return {
            ...json,
            priorityLabel: this.labels[priority],
            priorityColor: this.colors[priority],
        };
    }
}

export class DeadlineDecorator extends TodoDecorator {
    decorate(): Record<string, unknown> {
        const json = this.todo.toJSON();
        const dueDate = this.todo.dueDate;

        if (!dueDate) {
            return { ...json, deadlineStatus: 'no-deadline', daysRemaining: null };
        }

        const now = new Date();
        const diff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        let status = 'on-track';
        if (this.todo.completed) status = 'done';
        else if (diff < 0) status = 'overdue';
        else if (diff === 0) status = 'due-today';
        else if (diff <= 2) status = 'due-soon';

        return { ...json, deadlineStatus: status, daysRemaining: diff };
    }
}

export class FullDecorator extends TodoDecorator {
    decorate(): Record<string, unknown> {
        const withPriority = new PriorityLabelDecorator(this.todo).decorate();
        const withDeadline = new DeadlineDecorator(this.todo).decorate();
        return { ...withPriority, ...withDeadline };
    }
}
