import mongoose, { Schema, Document } from "mongoose";

interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
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

export default mongoose.model<IProblem>("Problem", problemSchema);