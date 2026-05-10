import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { MOCK_PROBLEMS } from "./src/data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/problems", (req, res) => {
    res.json(MOCK_PROBLEMS);
  });

  app.get("/api/problems/:id", (req, res) => {
    const problem = MOCK_PROBLEMS.find((p) => p.id === req.params.id);
    if (problem) {
      res.json(problem);
    } else {
      res.status(404).json({ error: "Problem not found" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    // Dummy login
    res.json({ success: true, message: "Logged in successfully" });
  });

  app.post("/api/signup", (req, res) => {
    const { username, email, password } = req.body;
    // Dummy signup
    res.json({ success: true, message: "Account created successfully" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
