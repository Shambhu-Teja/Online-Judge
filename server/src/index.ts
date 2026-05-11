import "dotenv/config";
import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "../db";
import healthRoutes from "./health";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import problemRoutes from "./routes/problemRoutes";
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/problem", problemRoutes);
// import userRoutes from "./users.js"; // add your routes here
// app.use("/api/users", userRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
