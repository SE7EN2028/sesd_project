import { Todo } from '../models/Todo';

export abstract class TodoExporter {
    export(todos: Todo[]): string {
        const header = this.buildHeader();
        const body = this.buildBody(todos);
        const footer = this.buildFooter(todos.length);
        return header + body + footer;
    }

    protected abstract buildHeader(): string;
    protected abstract buildBody(todos: Todo[]): string;
    protected abstract buildFooter(count: number): string;
    abstract getContentType(): string;
    abstract getFileExtension(): string;
}

export class JsonExporter extends TodoExporter {
    protected buildHeader(): string {
        return '';
    }

    protected buildBody(todos: Todo[]): string {
        return JSON.stringify({
            exportedAt: new Date().toISOString(),
            todos: todos.map(t => t.toJSON()),
        }, null, 2);
    }

    protected buildFooter(_count: number): string {
        return '';
    }

    getContentType(): string {
        return 'application/json';
    }

    getFileExtension(): string {
        return 'json';
    }
}

export class CsvExporter extends TodoExporter {
    protected buildHeader(): string {
        return 'ID,Title,Description,Type,Priority,Completed,Due Date,Created At\n';
    }

    protected buildBody(todos: Todo[]): string {
        return todos.map(t => {
            const j = t.toJSON();
            return [
                j.id,
                `"${(j.title as string).replace(/"/g, '""')}"`,
                `"${((j.description as string) || '').replace(/"/g, '""')}"`,
                j.type,
                j.priority,
                j.completed,
                j.dueDate ? new Date(j.dueDate as string).toISOString().split('T')[0] : '',
                new Date(j.createdAt as string).toISOString().split('T')[0],
            ].join(',');
        }).join('\n');
    }

    protected buildFooter(count: number): string {
        return `\n# Total: ${count} tasks`;
    }

    getContentType(): string {
        return 'text/csv';
    }

    getFileExtension(): string {
        return 'csv';
    }
}
