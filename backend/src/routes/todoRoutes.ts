import { Router } from 'express';
import ctrl from '../controllers/TodoController';
import { validateTodoCreate, validateTodoUpdate } from '../middlewares/validationMiddleware';

const router = Router();

router.get('/stats', ctrl.getStats);
router.get('/', ctrl.getAll);
router.post('/', validateTodoCreate, ctrl.create);
router.get('/:id', ctrl.getOne);
router.patch('/:id', validateTodoUpdate, ctrl.update);
router.patch('/:id/toggle', ctrl.toggle);
router.delete('/:id', ctrl.delete);

export default router;
