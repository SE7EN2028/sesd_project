import { BaseRepository } from './BaseRepository';
import { Category } from '../models/Category';

class CategoryRepository extends BaseRepository<Category> {
    async findByName(name: string): Promise<Category | undefined> {
        return Array.from(this.data.values()).find(c => c.name === name);
    }
}

export default new CategoryRepository();
