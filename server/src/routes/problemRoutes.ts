import {Router} from 'express';
import {authenticate} from '../middleware/authMiddleware';
import {createProblem} from '../controllers/problemController';
import {getProblem} from '../controllers/problemController';
import {getProblemsList} from '../controllers/problemController';
const router = Router();

router.post('/createProblem',authenticate,createProblem);
router.get('/:id',authenticate,getProblem);
router.post('/getProblemsList',authenticate,getProblemsList);

export default router;