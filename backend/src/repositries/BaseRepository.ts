import { BaseEntity } from '../models/BaseEntity';

export abstract class BaseRepository<T extends BaseEntity> {
    protected data: Map<number, T>;
    protected currentId: number;

    constructor() {
        this.data = new Map<number, T>();
        this.currentId = 1;
    }

    getNextId(): number {
        return this.currentId++;
    }

    async save(entity: T): Promise<T> {
        this.data.set(entity.id, entity);
        return entity;
    }

    async findAll(): Promise<T[]> {
        return Array.from(this.data.values());
    }

    async findById(id: number): Promise<T | undefined> {
        return this.data.get(id);
    }

    async update(id: number, updater: (entity: T) => void): Promise<T | null> {
        const entity = this.data.get(id);
        if (!entity) return null;
        updater(entity);
        return entity;
    }

    async delete(id: number): Promise<boolean> {
        return this.data.delete(id);
    }

    async count(): Promise<number> {
        return this.data.size;
    }
}
