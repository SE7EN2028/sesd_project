import { BaseEntity } from './BaseEntity';

export interface ISubTaskData {
    todoId: number;
    title: string;
    completed: boolean;
}

export class SubTask extends BaseEntity {
    private _todoId: number;
    private _title: string;
    private _completed: boolean;

    constructor(id: number, data: ISubTaskData) {
        super(id);
        this._todoId = data.todoId;
        this._title = data.title;
        this._completed = data.completed || false;
    }

    get todoId(): number { return this._todoId; }
    get title(): string { return this._title; }
    set title(v: string) { this._title = v; }
    get completed(): boolean { return this._completed; }
    set completed(v: boolean) { this._completed = v; }

    toggle(): void {
        this._completed = !this._completed;
    }

    toJSON(): Record<string, unknown> {
        return {
            id: this._id,
            todoId: this._todoId,
            title: this._title,
            completed: this._completed,
            createdAt: this._createdAt,
        };
    }
}
