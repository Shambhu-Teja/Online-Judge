import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getUser } from "../controllers/userController";

const router = Router();

router.get("/:id", authenticate, getUser);

export default router;