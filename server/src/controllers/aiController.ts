import { Request, Response } from "express";
import { runLLM } from "../utils/geminiAPI";
import { Problem } from "../../models/Problems";
export const codeReview = async (req: Request, res: Response) => {
  try {
    const { code, problemId } = req.body;
    if (!code || !problemId) {
      return res.status(400).json({
        success: false,
        message: "Missing code or problemId",
      });
    }
    const problemDescription = await Problem.findById(problemId).select("description");
    if (!problemDescription) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }
    
    const prompt = `Problem Description: ${problemDescription.description}\n\nCode:\n${code}\n\nPlease provide a code review(not more than 5-6 sentences unless required) for the above code based on the problem description. Highlight any potential issues, improvements Based on interview and problem solving.`;

    const review = await runLLM(prompt);

    return res.status(200).json({
      success: true,
      review,
    });
  }
    catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
