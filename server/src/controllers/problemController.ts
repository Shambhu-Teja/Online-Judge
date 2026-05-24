import { Request, Response } from "express";
import { Problem, TestCase } from "../../models/Problems";
import { executeCode } from "../services/runCodeService";

// RUN CODE
// CONTROLLER

export const runCode = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      code,
      language,
      problemId,
      customInputTestCase
    } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({
        success: false,
        message:
          "Code, language and problemId are required"
      });
    }

    const problem = await Problem.findById(problemId)
      .populate("sampleTestCase1")
      .populate("sampleTestCase2");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    const testCases: any[] = [
      problem.sampleTestCase1,
      problem.sampleTestCase2,
    ].filter(Boolean);

    // =========================
    // HANDLE CUSTOM INPUT
    // =========================

    if (customInputTestCase?.input) {

      // Run correct solution first
      const correctResult = await executeCode({
        code: problem.correctCode,
        language: "python", // store this in DB
        input: customInputTestCase.input,
        expectedOutput: "",
      });

      // Add generated testcase
      testCases.push({
        _id: "custom",
        input: customInputTestCase.input,
        expectedOutput: correctResult.output,
      });
    }

    const results = [];

    // =========================
    // RUN USER CODE
    // =========================

    for (const tc of testCases) {
      const result = await executeCode({
        code,
        language,
        input: tc.input,
        expectedOutput: tc.expectedOutput
      });

      results.push({
        testCaseId: tc._id,
        input: tc.input,
        ...result
      });
    }

    return res.status(200).json({
      success: true,
      results
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong"
    });
  }
};


// CREATE PROBLEM
export const createProblem = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      constraints,
      sampleTestCase1,
      sampleTestCase2,
      sampleTestCase1Explaination,
      sampleTestCase2Explaination,
      hint1,
      hint2,
      createdBy,
      testCases,
      correctCode
    } = req.body;

    // create problem first
    const createdProblem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      constraints,
      sampleTestCase1Explaination,
      sampleTestCase2Explaination,
      hint1,
      hint2,
      createdBy,
      correctCode
    });

    let createdTestCases: any[] = [];

    // create test cases
    if (testCases && testCases.length > 0) {
      const formattedTestCases = testCases.map(
        (tc: {
          testCaseNumber: number;
          input: string;
          expectedOutput: string;
          isHidden?: boolean;
        }) => ({
          ...tc,
          problemId: createdProblem._id
        })
      );

      createdTestCases = await TestCase.insertMany(
        formattedTestCases
      );
    }

    // set sample testcases
    if (
      sampleTestCase1 !== undefined &&
      createdTestCases[sampleTestCase1]
    ) {
      createdProblem.sampleTestCase1 =
        createdTestCases[sampleTestCase1]._id;
    }

    if (
      sampleTestCase2 !== undefined &&
      createdTestCases[sampleTestCase2]
    ) {
      createdProblem.sampleTestCase2 =
        createdTestCases[sampleTestCase2]._id;
    }

    await createdProblem.save();

    return res.status(201).json({
      success: true,
      problem: createdProblem,
      testCases: createdTestCases
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE PROBLEM
export const getProblem = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id)
      .populate("sampleTestCase1")
      .populate("sampleTestCase2");

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }


    return res.status(200).json({
      success: true,
      problem
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL PROBLEMS
export const getProblemsList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const problems = await Problem.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      problems
    });
  } catch (error) {
    console.error("Error fetching problems:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// UPDATE PROBLEM
export const updateProblem = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "title",
      "description",
      "difficulty",
      "tags",
      "constraints",
      "sampleTestCase1",
      "sampleTestCase2",
      "sampleTestCase1Explaination",
      "sampleTestCase2Explaination",
      "hint1",
      "hint2"
    ];

    const updateData: any = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        $set: updateData
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    return res.status(200).json({
      success: true,
      problem: updatedProblem
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE PROBLEM
export const deleteProblem = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    // delete all related testcases
    await TestCase.deleteMany({
      problemId: id
    });

    // delete problem
    await Problem.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE TEST CASE
export const createTestCase = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      problemId,
      testCaseNumber,
      input,
      expectedOutput,
      isHidden
    } = req.body;

    const problemExists = await Problem.findById(
      problemId
    );

    if (!problemExists) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    const testCase = await TestCase.create({
      problemId,
      testCaseNumber,
      input,
      expectedOutput,
      isHidden
    });

    return res.status(201).json({
      success: true,
      testCase
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE TEST CASE
export const updateTestCase = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "testCaseNumber",
      "input",
      "expectedOutput",
      "isHidden"
    ];

    const updateData: any = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updatedTestCase =
      await TestCase.findByIdAndUpdate(
        id,
        {
          $set: updateData
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedTestCase) {
      return res.status(404).json({
        success: false,
        message: "Test case not found"
      });
    }

    return res.status(200).json({
      success: true,
      testCase: updatedTestCase
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE TEST CASE
export const deleteTestCase = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const deletedTestCase =
      await TestCase.findByIdAndDelete(id);

    if (!deletedTestCase) {
      return res.status(404).json({
        success: false,
        message: "Test case not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test case deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};