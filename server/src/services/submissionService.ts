import { Problem, TestCase } from "../../models/Problems";
import { Submission } from "../../models/Submission";

import { executeCode } from "./runCodeService";

interface SubmitCodeParams {
  userId: string;
  problemId: string;
  code: string;
  language: "python" | "java" | "cpp";
}

export const submitCodeService = async ({
  userId,
  problemId,
  code,
  language,
}: SubmitCodeParams) => {
  const problem = await Problem.findById(
    problemId
  );

  if (!problem) {
    throw new Error("Problem not found");
  }

  const testCases = await TestCase.find({
    problemId,
  }).sort({
    testCaseNumber: 1,
  });

  let passedTestCases = 0;

  let totalExecutionTime = 0;

  let maxMemoryUsed = 0;

  let hasRuntimeError = false;

  const results = [];

  for (const testCase of testCases) {
    const start = Date.now();

    const result = await executeCode({
      code,
      language,
      input: testCase.input,
      expectedOutput:
        testCase.expectedOutput,
    });

    const end = Date.now();

    const executionTime = end - start;

    totalExecutionTime += executionTime;

    const memoryUsed =
      process.memoryUsage().heapUsed / 1024;

    maxMemoryUsed = Math.max(
      maxMemoryUsed,
      memoryUsed
    );

    if (result.passed) {
      passedTestCases++;
    }

    if (
      result.output.includes("Error") ||
      result.output.includes("Exception")
    ) {
      hasRuntimeError = true;
    }

    results.push({
      testCaseId: testCase._id,

      passed: result.passed,

      input: testCase.input,

      expectedOutput:
        result.expectedOutput,

      output: result.output,

      executionTime,

      memoryUsed,
    });
  }

  let status:
    | "Accepted"
    | "Wrong Answer"
    | "Runtime Error"
    | "Compilation Error" =
    "Wrong Answer";

  if (
    passedTestCases === testCases.length
  ) {
    status = "Accepted";
  } else if (hasRuntimeError) {
    status = "Runtime Error";
  }

  const submission =
    await Submission.create({
      userId,
      problemId,

      code,
      language,

      status,

      totalTestCases:
        testCases.length,

      passedTestCases,

      executionTime:
        totalExecutionTime,

      memoryUsed: maxMemoryUsed,

      results,
    });

  return submission;
};