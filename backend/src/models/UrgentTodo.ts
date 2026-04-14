import { Todo, ITodoData, TodoPriority } from './Todo';

export interface IUrgentTodoData extends ITodoData {
    escalationLevel?: number;
}

export class UrgentTodo extends Todo {
    private _escalationLevel: number;

    constructor(id: number, data: IUrgentTodoData) {
        super(id, { ...data, type: 'urgent' });
        this._escalationLevel = data.escalationLevel || 1;
    }

    get escalationLevel(): number { return this._escalationLevel; }
    set escalationLevel(v: number) { this._escalationLevel = v; }

    getPriority(): TodoPriority {
        return 'high';
    }

    getLabel(): string {
        return `Urgent (Level ${this._escalationLevel})`;
    }

    toJSON(): Record<string, unknown> {
        return { ...super.toJSON(), escalationLevel: this._escalationLevel };
    }
}
