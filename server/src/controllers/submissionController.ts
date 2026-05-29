import { Request, Response } from "express";
import { submitCodeService } from "../services/submissionService";
import { Submission } from "../../models/Submission";

export const submitCode = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      problemId,
      code,
      language,
    } = req.body;

    console.log("userId:", userId);
    console.log("problemId:", problemId);
    console.log("code:", code);
    console.log("language:", language);
    if (
      !userId ||
      !problemId ||
      !code ||
      !language
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    const submission =
      await submitCodeService({
        userId,
        problemId,
        code,
        language,
      });

    return res.status(200).json({
      success: true,
      submission,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSubmissions = async (req: Request, res: Response) => {
  try {    
    const { userId, problemId } = req.query;
    console.log(req.query);
    if (!userId || !problemId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or problemId",
      });
    }

    const submissions = await Submission.find({
      userId,
      problemId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const getSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }
    return res.status(200).json({
      success: true,
      submission,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}