import {Router} from 'express';
import {authenticate} from '../middleware/authMiddleware';
import {createProblem} from '../controllers/problemController';
import {getProblem, updateProblem, deleteProblem, createTestCase, updateTestCase, deleteTestCase} from '../controllers/problemController';
import {getProblemsList} from '../controllers/problemController';
import {runCode} from '../controllers/problemController';
import { submitCode, getSubmissions, getSubmission } from '../controllers/submissionController';
import { codeReview } from '../controllers/aiController';

const router = Router();


router.post("/",authenticate, createProblem);
router.patch("/:id", authenticate, updateProblem);
router.delete("/:id", authenticate, deleteProblem);

// Test Case Routes
router.post("/testcases", authenticate,createTestCase);
router.patch("/testcases/:id",authenticate, updateTestCase);
router.delete("/testcases/:id", authenticate, deleteTestCase);

router.post('/getProblemsList',authenticate,getProblemsList);

router.post('/runCode',authenticate,runCode);

router.post('/submitCode',authenticate,submitCode);

router.get('/getSubmissions',authenticate,getSubmissions);
router.get("/submissions/:id", authenticate, getSubmission);



router.post("/getProblemsList", authenticate, getProblemsList);

router.post("/aiCodeReview", authenticate, codeReview);

router.get("/:id", authenticate, getProblem);
export default router; 