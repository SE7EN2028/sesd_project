import { BaseEntity } from './BaseEntity';

export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoType = 'personal' | 'work' | 'urgent';

export interface ITodoData {
    title: string;
    description: string;
    completed: boolean;
    dueDate?: Date;
    categoryId?: number;
    type: TodoType;
}

export abstract class Todo extends BaseEntity {
    private _title: string;
    private _description: string;
    private _completed: boolean;
    private _dueDate: Date | undefined;
    private _categoryId: number | undefined;
    private _type: TodoType;

    constructor(id: number, data: ITodoData) {
        super(id);
        this._title = data.title;
        this._description = data.description;
        this._completed = data.completed || false;
        this._dueDate = data.dueDate;
        this._categoryId = data.categoryId;
        this._type = data.type;
    }

    get title(): string { return this._title; }
    set title(v: string) { this._title = v; }

    get description(): string { return this._description; }
    set description(v: string) { this._description = v; }

    get completed(): boolean { return this._completed; }
    set completed(v: boolean) { this._completed = v; }

    get dueDate(): Date | undefined { return this._dueDate; }
    set dueDate(v: Date | undefined) { this._dueDate = v; }

    get categoryId(): number | undefined { return this._categoryId; }
    set categoryId(v: number | undefined) { this._categoryId = v; }

    get type(): TodoType { return this._type; }

    abstract getPriority(): TodoPriority;

    abstract getLabel(): string;

    toJSON(): Record<string, unknown> {
        return {
            id: this._id,
            title: this._title,
            description: this._description,
            completed: this._completed,
            dueDate: this._dueDate,
            categoryId: this._categoryId,
            type: this._type,
            priority: this.getPriority(),
            label: this.getLabel(),
            createdAt: this._createdAt,
        };
    }
}
