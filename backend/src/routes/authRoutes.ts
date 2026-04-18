import { Router } from 'express';
import ctrl from '../controllers/AuthController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authenticate, ctrl.me);

export default router;
