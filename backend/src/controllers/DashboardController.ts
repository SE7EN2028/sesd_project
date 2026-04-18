import { Request, Response, NextFunction } from 'express';
import dashboardService from '../services/DashboardService';

class DashboardController {
    async getOverview(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await dashboardService.getOverview();
            res.json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }
}

export default new DashboardController();
