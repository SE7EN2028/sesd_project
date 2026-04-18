import { Router } from 'express';
import ctrl from '../controllers/DashboardController';

const router = Router();

router.get('/overview', ctrl.getOverview);

export default router;
