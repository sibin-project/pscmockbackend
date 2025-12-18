import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  selectedOption: String,
  isCorrect: Boolean,
  approved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Answer = mongoose.model("Answer", AnswerSchema);
export default Answer;
