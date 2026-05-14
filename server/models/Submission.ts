import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;

  code: string;
  language: "cpp" | "python" | "java";

  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error";

  totalTestCases: number;
  passedTestCases: number;

  executionTime: number; // milliseconds
  memoryUsed: number; // KB

  results: {
    testCaseId: mongoose.Types.ObjectId;
    passed: boolean;
    input: string;
    expectedOutput: string;
    output: string;
    executionTime: number;
    memoryUsed: number;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      enum: ["cpp", "python", "java"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Runtime Error",
        "Compilation Error",
      ],
      required: true,
    },

    totalTestCases: {
      type: Number,
      required: true,
    },

    passedTestCases: {
      type: Number,
      required: true,
    },

    executionTime: {
      type: Number,
      default: 0,
    },

    memoryUsed: {
      type: Number,
      default: 0,
    },

    results: [
      {
        testCaseId: {
          type: Schema.Types.ObjectId,
          ref: "TestCase",
        },

        passed: {
          type: Boolean,
          required: true,
        },

        input: {
          type: String,
          required: true,
        },

        expectedOutput: {
          type: String,
          required: true,
        },

        output: {
          type: String,
          required: true,
        },

        executionTime: {
          type: Number,
          default: 0,
        },

        memoryUsed: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Submission = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema
);