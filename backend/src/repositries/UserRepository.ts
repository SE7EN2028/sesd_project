import { BaseRepository } from './BaseRepository';
import { User } from '../models/User';

class UserRepository extends BaseRepository<User> {
    async findByEmail(email: string): Promise<User | undefined> {
        return Array.from(this.data.values()).find(u => u.email === email);
    }
}

export default new UserRepository();
