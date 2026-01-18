import express from "express";
import mongoose from "mongoose";
import Question from "../models/question.js";
import Answer from "../models/answer.js";
import AdContent from "../models/adContent.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Get questions (public, no auth needed)
router.get("/questions", async (req, res) => {
  const questions = await Question.find({}).lean();
  const filtered = questions.filter(q => q.options && Object.keys(q.options).length > 0);
  res.json(filtered);
});

// Get single question by ID (public)
router.get("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Error fetching question" });
  }
});

// Submit answer (requires auth)
router.post("/answer", authenticate, async (req, res) => {
  const { questionId, selectedOption, approved = true } = req.body;
  const userId = req.user.id;

  // Check if already answered
  const existing = await Answer.findOne({ user: userId, questionId });
  if (existing) {
    return res.status(400).json({ message: "You have already answered this question" });
  }

  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ message: "Question not found" });

  const isCorrect = ['A', 'B', 'C', 'D'].includes(question.correctAnswer)
    ? selectedOption === question.options[question.correctAnswer]
    : selectedOption === question.correctAnswer;

  const answer = new Answer({
    user: userId,
    questionId,
    selectedOption,
    isCorrect,
    approved
  });
  await answer.save();

  res.json({ isCorrect, correctAnswer: ['A', 'B', 'C', 'D'].includes(question.correctAnswer) ? question.options[question.correctAnswer] : question.correctAnswer });
});

// Get user answer for a question (requires auth)
router.get("/user/answers/:questionId", authenticate, async (req, res) => {
  const { questionId } = req.params;
  const userId = req.user.id;

  const answer = await Answer.findOne({ user: userId, questionId });
  if (answer) {
    const question = await Question.findById(questionId);
    const correctAnswerText = ['A', 'B', 'C', 'D'].includes(question.correctAnswer) ? question.options[question.correctAnswer] : question.correctAnswer;
    res.json({ hasAnswered: true, selectedOption: answer.selectedOption, isCorrect: answer.isCorrect, correctAnswer: correctAnswerText });
  } else {
    res.json({ hasAnswered: false });
  }
});

// Get poll stats for a question (public)
router.get("/questions/:questionId/stats", async (req, res) => {
  const { questionId } = req.params;

  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ message: "Question not found" });

  const stats = await Answer.aggregate([
    { $match: { questionId: new mongoose.Types.ObjectId(questionId) } },
    { $group: { _id: "$selectedOption", count: { $sum: 1 } } }
  ]);

  const result = { A: 0, B: 0, C: 0, D: 0, total: 0 };
  stats.forEach(s => {
    const optionKey = Object.keys(question.options).find(k => question.options[k] === s._id);
    if (optionKey) {
      result[optionKey] = s.count;
    }
    result.total += s.count;
  });

  res.json(result);
});

// User dashboard (requires auth)
router.get("/dashboard", authenticate, async (req, res) => {
  const userId = req.user.id;
  const answers = await Answer.find({ user: userId }).populate("questionId");

  const totalAttempted = answers.length;
  let correct = 0;
  answers.forEach(a => {
    if (a.isCorrect) correct++;
  });
  const wrong = totalAttempted - correct;
  const accuracy = totalAttempted > 0 ? ((correct / totalAttempted) * 100).toFixed(2) : 0;

  res.json({
    totalAttempted,
    correct,
    wrong,
    accuracy
  });
});

// Get attempted questions (requires auth)
router.get("/attempted-questions", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const answers = await Answer.find({ user: userId }).populate("questionId");

    const attemptedQuestions = answers
      .filter(answer => answer.questionId) // Filter out answers where question was deleted
      .map(answer => ({
        ...answer.questionId.toObject(),
        userAnswer: answer.selectedOption,
        isCorrect: answer.isCorrect,
        correctAnswer: ['A', 'B', 'C', 'D'].includes(answer.questionId.correctAnswer)
          ? answer.questionId.options[answer.questionId.correctAnswer]
          : answer.questionId.correctAnswer
      }));

    res.json(attemptedQuestions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching attempted questions", error: err.message });
  }
});

// Get ad content (public, no auth needed)
router.get("/ad-content", async (req, res) => {
  try {
    let adContent = await AdContent.findOne();
    if (!adContent) {
      adContent = {
        tipsTitle: "Quick Tips & Notifications",
        tipsText: "Practice regularly to improve your accuracy",
        quickTip1: "",
        quickTip2: "",
        quickTip3: ""
      };
    }
    res.json(adContent);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ad content", error: err.message });
  }
});

export default router;