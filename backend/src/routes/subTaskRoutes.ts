import { Router } from 'express';
import ctrl from '../controllers/SubTaskController';

const router = Router();

router.get('/todo/:todoId', ctrl.getByTodo);
router.post('/todo/:todoId', ctrl.create);
router.get('/todo/:todoId/progress', ctrl.getProgress);
router.patch('/:id/toggle', ctrl.toggle);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

export default router;
