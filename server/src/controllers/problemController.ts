import e, { Request, Response } from "express";
import Problem from "../../models/Problems";

export const createProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, difficulty, tags } = req.body;
    console.log("Received problem data:", { title, description, difficulty, tags });
    if(!title || !description || !difficulty) {
      res.status(400).json({ message: "Title, description, and difficulty are required" });
      return;
    }

    const problem = await Problem.create({ title, description, difficulty, tags });
    res.status(200).json(problem);
  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProblem = async (req: Request, res: Response): Promise<void> => {
  try {

    const { id } = req.query;
    if(id) {
      const problem = await Problem.findById(id);
        if (!problem) {
          res.status(404).json({ message: "Problem not found" });
          return;
        }
        res.status(200).json(problem);
    } else {
      const problems = await Problem.find();
      res.status(200).json(problems);
    }
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProblemsList = async (req: Request, res: Response): Promise<void> => {
    try {
      const problems = await Problem.find();
      res.status(200).json(problems);
    } catch (error) {
      console.error("Error fetching problems:", error);
      res.status(500).json({ message: "Server error" });
    }
  };