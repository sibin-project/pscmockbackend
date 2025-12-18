import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: {
    A: String,
    B: String,
    C: String,
    D: String
  },
  correctAnswer: String
});

const Question = mongoose.model("Question", QuestionSchema);
export default Question;