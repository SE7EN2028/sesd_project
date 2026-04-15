import categoryRepository from '../repositries/CategoryRepository';
import { Category } from '../models/Category';
import { AppError } from '../utils/AppError';
import { EventManager } from '../observers/EventManager';

class CategoryService {
    private eventManager = EventManager.getInstance();

    async create(data: any): Promise<Record<string, unknown>> {
        const existing = await categoryRepository.findByName(data.name);
        if (existing) throw new AppError('Category already exists', 400);

        const id = categoryRepository.getNextId();
        const category = new Category(id, {
            name: data.name,
            color: data.color || '#6b7280',
        });

        await categoryRepository.save(category);
        this.eventManager.emit('category:created', category.toJSON());
        return category.toJSON();
    }

    async findAll(): Promise<Record<string, unknown>[]> {
        const categories = await categoryRepository.findAll();
        return categories.map(c => c.toJSON());
    }

    async findById(id: number): Promise<Record<string, unknown>> {
        const category = await categoryRepository.findById(id);
        if (!category) throw new AppError('Category not found', 404);
        return category.toJSON();
    }

    async update(id: number, data: any): Promise<Record<string, unknown>> {
        const updated = await categoryRepository.update(id, (cat) => {
            if (data.name) cat.name = data.name;
            if (data.color) cat.color = data.color;
        });
        if (!updated) throw new AppError('Category not found', 404);
        this.eventManager.emit('category:updated', updated.toJSON());
        return updated.toJSON();
    }

    async delete(id: number): Promise<boolean> {
        const cat = await categoryRepository.findById(id);
        if (!cat) throw new AppError('Category not found', 404);
        const result = await categoryRepository.delete(id);
        this.eventManager.emit('category:deleted', { id });
        return result;
    }
}

export default new CategoryService();
