# Todo Application

A full-stack Todo Application built with TypeScript, demonstrating OOP principles, design patterns, and clean layered architecture.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript (in-memory storage)
- **Frontend**: React, Vite, TypeScript

## OOP Principles
- **Encapsulation**: Private fields with getters/setters in all entity classes
- **Abstraction**: `BaseEntity` abstract class, `BaseRepository<T>` generic abstract class
- **Inheritance**: `Todo` -> `PersonalTodo`, `WorkTodo`, `UrgentTodo`
- **Polymorphism**: `getPriority()` and `getLabel()` methods behave differently per todo type

## Design Patterns
- **Factory Pattern**: `TodoFactory` creates correct todo subclass based on type
- **Strategy Pattern**: `SortStrategy` interface with date, priority, created sort implementations
- **Observer Pattern**: `EventManager` emits events on CRUD operations
- **Repository Pattern**: Generic `BaseRepository<T>` with entity-specific extensions
- **Singleton Pattern**: Factory, EventManager, and repository instances

## Architecture
```
Controller -> Service -> Repository
                |
            Factory (creates entities)
            Strategy (sorts todos)
            Observer (emits events)
```

## Setup and Run

### Backend
```bash
cd backend
npm install
npm run dev
```
Server runs on http://localhost:5001

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## API Endpoints

### Todos
- `GET /api/v1/todos` - List all (filters: `?type=`, `?completed=`, `?sort=date|priority|created`)
- `POST /api/v1/todos` - Create (type: personal, work, urgent)
- `GET /api/v1/todos/:id` - Get one
- `PATCH /api/v1/todos/:id` - Update
- `PATCH /api/v1/todos/:id/toggle` - Toggle completion
- `DELETE /api/v1/todos/:id` - Delete
- `GET /api/v1/todos/stats` - Statistics

### Categories
- `GET /api/v1/categories` - List all
- `POST /api/v1/categories` - Create
- `GET /api/v1/categories/:id` - Get one
- `PATCH /api/v1/categories/:id` - Update
- `DELETE /api/v1/categories/:id` - Delete
