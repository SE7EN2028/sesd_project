import { Router } from 'express';
import ctrl from '../controllers/CategoryController';

const router = Router();

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getOne);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

export default router;
