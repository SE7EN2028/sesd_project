import { Todo, ITodoData, TodoPriority } from './Todo';

export interface IPersonalTodoData extends ITodoData {
    tag?: string;
}

export class PersonalTodo extends Todo {
    private _tag: string;

    constructor(id: number, data: IPersonalTodoData) {
        super(id, { ...data, type: 'personal' });
        this._tag = data.tag || 'general';
    }

    get tag(): string { return this._tag; }
    set tag(v: string) { this._tag = v; }

    getPriority(): TodoPriority {
        if (this._tag === 'health' || this._tag === 'finance') return 'high';
        if (this._tag === 'hobby') return 'low';
        return 'medium';
    }

    getLabel(): string {
        return `Personal - ${this._tag}`;
    }

    toJSON(): Record<string, unknown> {
        return { ...super.toJSON(), tag: this._tag };
    }
}
