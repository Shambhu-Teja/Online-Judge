import express, { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    db: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
