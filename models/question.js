import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: {
    A: String,
    B: String,
    C: String,
    D: String
  },
  correctAnswer: String,
  category: { type: String, default: "" },
  subcategory: { type: String, default: "" },
  explanation: { type: String, default: "" },
  isApproved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model("Question", QuestionSchema);
export default Question;