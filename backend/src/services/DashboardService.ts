import todoService from './TodoService';
import categoryService from './CategoryService';
import { EventManager } from '../observers/EventManager';

class DashboardService {
    private eventManager = EventManager.getInstance();

    async getOverview(): Promise<Record<string, unknown>> {
        const todoStats = await todoService.getStats();
        const categories = await categoryService.findAll();
        const activity = this.eventManager.getRecentActivity(15);

        return {
            todos: todoStats,
            totalCategories: categories.length,
            recentActivity: activity.map(a => ({
                event: a.event,
                data: a.data,
                time: a.timestamp,
            })),
        };
    }
}

export default new DashboardService();
