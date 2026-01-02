import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    status: {
      type: String,
      enum: ["started", "completed", "abandoned"],
      default: "started",
    },

    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", interviewSessionSchema);
