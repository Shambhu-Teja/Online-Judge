import { Request, Response } from "express";
import { submitCodeService } from "../services/submissionService";

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