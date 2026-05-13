import mongoose, { Schema, Document } from "mongoose";

interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  constraints: string;
  sampleTestCase1: ITestCase;
  sampleTestCase2: ITestCase;
  sampleTestCase1Explaination: string;
  sampleTestCase2Explaination: string;
  hint1?: string;
  hint2?: string;
  createdBy: mongoose.Types.ObjectId|null;
}

const problemSchema = new Schema<IProblem>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    constraints: {
      type: String,
      default: ""
    },
    sampleTestCase1: {
      type: Schema.Types.ObjectId,
      ref: "TestCase"
    },
    sampleTestCase2: {
      type: Schema.Types.ObjectId,
      ref: "TestCase"
    },
    sampleTestCase1Explaination: {
      type: String,
      default: ""
    },
    sampleTestCase2Explaination: {
      type: String,
      default: ""
    },
    hint1: {
      type: String,
      default: ""
    },
    hint2: {
      type: String,
      default: ""
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const Problem = mongoose.model<IProblem>("Problem", problemSchema);

//test case schema

interface ITestCase extends Document {
  problemId: mongoose.Types.ObjectId;
  testCaseNumber: number;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

const testCaseSchema = new Schema<ITestCase>(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
    testCaseNumber: {
      type: Number,
      required: true
    },
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const TestCase = mongoose.model<ITestCase>("TestCase", testCaseSchema);