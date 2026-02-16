# Project Idea: Todo Application

## Overview
A full-stack Todo Application that demonstrates core software engineering principles including OOP, design patterns, and clean layered architecture.

## Scope

### Core Entities
- **Todos** with different types (Personal, Work, Urgent) each having distinct priority calculation logic
- **Categories** for organizing todos by topic

### Key Features
1. **Todo Management (CRUD)**
   - Create todos of different types (Personal, Work, Urgent)
   - Each type has unique priority calculation (polymorphism)
   - Toggle completion status
   - Filter by type, status, category
   - Sort by date, priority, or creation time (Strategy pattern)

2. **Category Management**
   - Create and manage categories with colors
   - Organize todos by category

3. **Dashboard**
   - Total, completed, pending counts
   - Breakdown by type and priority

## OOP Principles Demonstrated

| Principle | Where Applied |
|-----------|--------------|
| **Encapsulation** | Private fields in models, access via getters/setters |
| **Abstraction** | Abstract `BaseEntity` and `BaseRepository` classes |
| **Inheritance** | `PersonalTodo`, `WorkTodo`, `UrgentTodo` extend abstract `Todo` |
| **Polymorphism** | `getPriority()` and `getLabel()` behave differently per todo type |

## Design Patterns Used

| Pattern | Where Applied |
|---------|--------------|
| **Factory** | `TodoFactory` creates correct todo subclass based on type |
| **Strategy** | `SortStrategy` interface with date, priority, created sort strategies |
| **Observer** | `EventManager` emits events on CRUD operations for activity logging |
| **Repository** | Generic `BaseRepository<T>` with entity-specific extensions |
| **Singleton** | Factory, EventManager, and repository instances |

## Tech Stack
- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React (Vite), TypeScript
- **Storage**: In-memory (Map-based repositories)
- **Architecture**: Controller -> Service -> Repository (3-layer)
