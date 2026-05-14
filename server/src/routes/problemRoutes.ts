import {Router} from 'express';
import {authenticate} from '../middleware/authMiddleware';
import {createProblem} from '../controllers/problemController';
import {getProblem, updateProblem, deleteProblem, createTestCase, updateTestCase, deleteTestCase} from '../controllers/problemController';
import {getProblemsList} from '../controllers/problemController';
import {runCode} from '../controllers/problemController';
import { submitCode } from '../controllers/submissionController';

const router = Router();


router.post("/",authenticate, createProblem);
router.get("/:id", authenticate, getProblem);
router.patch("/:id", authenticate, updateProblem);
router.delete("/:id", authenticate, deleteProblem);

// Test Case Routes
router.post("/testcases", authenticate,createTestCase);
router.patch("/testcases/:id",authenticate, updateTestCase);
router.delete("/testcases/:id", authenticate, deleteTestCase);

router.post('/getProblemsList',authenticate,getProblemsList);

router.post('/runCode',authenticate,runCode);

router.post('/submitCode',authenticate,submitCode);

export default router;