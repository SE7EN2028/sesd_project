import { Todo, TodoType } from '../models/Todo';
import { PersonalTodo } from '../models/PersonalTodo';
import { WorkTodo } from '../models/WorkTodo';
import { UrgentTodo } from '../models/UrgentTodo';

export class TodoFactory {
    private static _instance: TodoFactory;

    private constructor() {}

    static getInstance(): TodoFactory {
        if (!TodoFactory._instance) {
            TodoFactory._instance = new TodoFactory();
        }
        return TodoFactory._instance;
    }

    createTodo(id: number, type: TodoType, data: any): Todo {
        switch (type) {
            case 'personal':
                return new PersonalTodo(id, data);
            case 'work':
                return new WorkTodo(id, data);
            case 'urgent':
                return new UrgentTodo(id, data);
            default:
                throw new Error(`Unknown todo type: ${type}`);
        }
    }
}
