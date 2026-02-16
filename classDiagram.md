# Class Diagram

```mermaid
classDiagram
    class BaseEntity {
        <<abstract>>
        #_id: number
        #_createdAt: Date
        +id: number
        +createdAt: Date
        +toJSON(): Record*
    }

    class Todo {
        <<abstract>>
        -_title: string
        -_description: string
        -_completed: boolean
        -_dueDate: Date
        -_categoryId: number
        -_type: TodoType
        +title: string
        +description: string
        +completed: boolean
        +dueDate: Date
        +type: TodoType
        +getPriority(): TodoPriority*
        +getLabel(): string*
        +toJSON(): Record
    }

    class PersonalTodo {
        -_tag: string
        +tag: string
        +getPriority(): TodoPriority
        +getLabel(): string
    }

    class WorkTodo {
        -_project: string
        -_assignee: string
        +project: string
        +assignee: string
        +getPriority(): TodoPriority
        +getLabel(): string
    }

    class UrgentTodo {
        -_escalationLevel: number
        +escalationLevel: number
        +getPriority(): TodoPriority
        +getLabel(): string
    }

    class Category {
        -_name: string
        -_color: string
        +name: string
        +color: string
        +toJSON(): Record
    }

    BaseEntity <|-- Todo
    BaseEntity <|-- Category
    Todo <|-- PersonalTodo
    Todo <|-- WorkTodo
    Todo <|-- UrgentTodo

    class BaseRepository~T~ {
        <<abstract>>
        #data: Map~number, T~
        #currentId: number
        +getNextId(): number
        +save(entity): T
        +findAll(): T[]
        +findById(id): T
        +update(id, updater): T
        +delete(id): boolean
        +count(): number
    }

    class TodoRepository {
        +findByCategory(id): Todo[]
        +findByType(type): Todo[]
        +findCompleted(): Todo[]
        +findPending(): Todo[]
    }

    class CategoryRepository {
        +findByName(name): Category
    }

    BaseRepository <|-- TodoRepository
    BaseRepository <|-- CategoryRepository

    class TodoFactory {
        -_instance: TodoFactory
        +getInstance(): TodoFactory
        +createTodo(id, type, data): Todo
    }

    class SortStrategy {
        <<interface>>
        +sort(todos): Todo[]
    }

    class SortByDateStrategy {
        +sort(todos): Todo[]
    }

    class SortByPriorityStrategy {
        +sort(todos): Todo[]
    }

    class SortByCreatedStrategy {
        +sort(todos): Todo[]
    }

    SortStrategy <|.. SortByDateStrategy
    SortStrategy <|.. SortByPriorityStrategy
    SortStrategy <|.. SortByCreatedStrategy

    class EventManager {
        -_instance: EventManager
        -listeners: Map
        -activityLog: IActivityLog[]
        +getInstance(): EventManager
        +on(event, callback): void
        +emit(event, data): void
        +off(event, callback): void
        +getRecentActivity(limit): IActivityLog[]
    }

    class TodoService {
        -factory: TodoFactory
        -eventManager: EventManager
        +create(data): Record
        +findAll(query): Record[]
        +findAllSorted(strategy, query): Record[]
        +findById(id): Record
        +update(id, data): Record
        +toggleComplete(id): Record
        +delete(id): boolean
        +getStats(): Record
    }

    class CategoryService {
        -eventManager: EventManager
        +create(data): Record
        +findAll(): Record[]
        +findById(id): Record
        +update(id, data): Record
        +delete(id): boolean
    }

    TodoService --> TodoRepository
    TodoService --> TodoFactory
    TodoService --> EventManager
    CategoryService --> CategoryRepository
    CategoryService --> EventManager

    TodoFactory ..> PersonalTodo : creates
    TodoFactory ..> WorkTodo : creates
    TodoFactory ..> UrgentTodo : creates
```

## Relationships Summary

| Relationship | Type | Description |
|-------------|------|-------------|
| BaseEntity -> Todo, Category | Inheritance | All entities extend BaseEntity |
| Todo -> PersonalTodo, WorkTodo, UrgentTodo | Inheritance | Todo type hierarchy |
| BaseRepository -> TodoRepository, CategoryRepository | Inheritance | Generic CRUD inherited |
| SortStrategy -> Concrete Strategies | Implementation | Strategy pattern |
| TodoFactory -> Todo subclasses | Creation | Factory pattern |
| EventManager -> Services | Association | Observer pattern |
