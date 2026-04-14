import { Todo, ITodoData, TodoPriority } from './Todo';

export interface IWorkTodoData extends ITodoData {
    project?: string;
    assignee?: string;
}

export class WorkTodo extends Todo {
    private _project: string;
    private _assignee: string;

    constructor(id: number, data: IWorkTodoData) {
        super(id, { ...data, type: 'work' });
        this._project = data.project || '';
        this._assignee = data.assignee || '';
    }

    get project(): string { return this._project; }
    set project(v: string) { this._project = v; }

    get assignee(): string { return this._assignee; }
    set assignee(v: string) { this._assignee = v; }

    getPriority(): TodoPriority {
        if (this.dueDate) {
            const daysLeft = (this.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
            if (daysLeft < 2) return 'high';
            if (daysLeft < 7) return 'medium';
        }
        return 'medium';
    }

    getLabel(): string {
        return this._project ? `Work - ${this._project}` : 'Work';
    }

    toJSON(): Record<string, unknown> {
        return { ...super.toJSON(), project: this._project, assignee: this._assignee };
    }
}
