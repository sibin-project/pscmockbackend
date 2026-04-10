import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Question from "../models/question.js";
import Answer from "../models/answer.js";
import AdContent from "../models/adContent.js";
import { authenticate, adminOnly } from "../middleware/auth.js";
import shuffleOptions from "../utils/shuffle.js";
import { generatePSCQuestion } from "../utils/aiService.js";


const router = express.Router();

// Setup Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.'));
    }
  }
});

router.use(authenticate);
router.use(adminOnly);

/* ================= PRODUCT IMAGE UPLOAD ================= */
router.post("/upload-product-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = req.file.path; // Cloudinary returns the full URL in path
    res.json({
      message: "Image uploaded successfully",
      imageUrl
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err.message });
  }
});

/* ================= JSON TEXT UPLOAD ================= */
router.post("/upload-json", async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({
        message: "Invalid JSON format. Expected { questions: [] }"
      });
    }

    const processedQuestions = questions.map(q => {
      if (q.options && q.correctAnswer) {
        // Shuffle existing options
        const values = Object.values(q.options);
        const shuffled = [...values];
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const newOptions = {};
        const labels = ["A", "B", "C", "D"];
        shuffled.forEach((val, idx) => {
          newOptions[labels[idx]] = val;
        });
        const correctValue = ['A', 'B', 'C', 'D'].includes(q.correctAnswer) ? q.options[q.correctAnswer] : q.correctAnswer;
        const newCorrectAnswer = Object.keys(newOptions).find(k => newOptions[k] === correctValue) || "A";
        return {
          question: q.question,
          options: newOptions,
          correctAnswer: newOptions[newCorrectAnswer],
          category: q.category || "",
          subcategory: q.subcategory || "",
          explanation: q.explanation || ""
        };
      } else if (q.correct && q.wrongOptions) {
        // Need to shuffle
        const { options, correctAnswer } = shuffleOptions(q.correct, q.wrongOptions);
        return {
          question: q.question,
          options,
          correctAnswer,
          category: q.category || "",
          subcategory: q.subcategory || "",
          explanation: q.explanation || "",
          isApproved: true
        };
      } else {
        throw new Error("Each question must have either 'options' and 'correctAnswer' or 'correct' and 'wrongOptions'");
      }
    });

    await Question.insertMany(processedQuestions);

    res.json({ message: "Questions uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "JSON upload failed" });
  }
});

/* ================= SUGGESTIONS (CORRECTIONS) ================= */
router.get("/suggestions", async (req, res) => {
  const answers = await Answer.find({ approved: false })
    .populate({
      path: "questionId",
      select: "question options correctAnswer"
    });

  const normalized = answers.map(a => {
    if (!a.questionId) return null;
    return {
      _id: a._id,
      suggestedAnswer: a.selectedOption,
      question: {
        ...a.questionId.toObject(),
        correctAnswer: ['A', 'B', 'C', 'D'].includes(a.questionId.correctAnswer) ? a.questionId.options[a.questionId.correctAnswer] : a.questionId.correctAnswer
      }
    };
  }).filter(Boolean);

  res.json(normalized);
});

/* ================= SUGGESTED QUESTIONS ================= */
router.get("/suggested-questions", async (req, res) => {
  const questions = await Question.find({ isApproved: false });
  res.json(questions);
});

router.post("/approve-question/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question approved", question });
  } catch (err) {
    res.status(500).json({ message: "Error approving question", error: err.message });
  }
});

/* ================= APPROVE SUGGESTION (CORRECTION) ================= */
router.post("/approve/:id", async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!answer) return res.status(404).json({ message: "Suggestion not found" });
    res.json({ message: "Suggestion approved", answer });
  } catch (err) {
    res.status(500).json({ message: "Error approving suggestion", error: err.message });
  }
});

/* ================= REJECT SUGGESTION (CORRECTION) ================= */
router.post("/reject/:id", async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);
    if (!answer) return res.status(404).json({ message: "Suggestion not found" });
    res.json({ message: "Suggestion rejected and deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting suggestion", error: err.message });
  }
});

/* ================= EDIT QUESTIONS ================= */
router.get("/questions", async (req, res) => {
  const questions = await Question.find({ isApproved: { $ne: false } });
  const normalized = questions.map(q => ({
    ...q.toObject(),
    correctAnswer: ['A', 'B', 'C', 'D'].includes(q.correctAnswer) ? q.options[q.correctAnswer] : q.correctAnswer
  }));
  res.json(normalized);
});

router.put("/questions/:id", async (req, res) => {
  const { question, options, correctAnswer, category, subcategory, explanation } = req.body;
  await Question.findByIdAndUpdate(req.params.id, { question, options, correctAnswer, category, subcategory, explanation });
  res.json({ message: "Question updated" });
});

/* ================= ADD SINGLE QUESTION ================= */
router.post("/question", async (req, res) => {
  try {
    const { question, options, correctAnswer, category, subcategory, explanation } = req.body;

    let finalCorrectAnswer = correctAnswer;
    if (['A', 'B', 'C', 'D'].includes(correctAnswer)) {
      finalCorrectAnswer = options[correctAnswer];
    }

    const newQuestion = new Question({
      question,
      options,
      correctAnswer: finalCorrectAnswer,
      category: category || "",
      subcategory: subcategory || "",
      explanation: explanation || "",
      isApproved: true
    });

    await newQuestion.save();
    res.json({ message: "Question added successfully", question: newQuestion });
  } catch (err) {
    console.error("Add Question Error:", err);
    res.status(500).json({ 
      message: "Error adding question", 
      error: err.message,
      details: err.errors // Include Mongoose validation errors if any
    });
  }
});

/* ================= AI GENERATE QUESTION ================= */
router.post("/generate-ai", async (req, res) => {
  try {
    const { category, subcategory } = req.body;
    const aiQuestion = await generatePSCQuestion(category, subcategory);
    res.json(aiQuestion);
  } catch (err) {
    res.status(500).json({ message: "AI Generation failed", error: err.message });
  }
});

/* ================= DELETE QUESTION ================= */

router.delete("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting question", error: err.message });
  }
});

router.post("/shuffle-questions", async (req, res) => {
  const questions = await Question.find({});
  for (const q of questions) {
    if (q.options && Object.keys(q.options).length === 4) {
      const values = Object.values(q.options);
      const shuffled = [...values];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const newOptions = {};
      const labels = ["A", "B", "C", "D"];
      shuffled.forEach((val, idx) => {
        newOptions[labels[idx]] = val;
      });
      const correctValue = ['A', 'B', 'C', 'D'].includes(q.correctAnswer) ? q.options[q.correctAnswer] : q.correctAnswer;
      q.options = newOptions;
      q.correctAnswer = correctValue;
      await q.save();
    }
  }
  res.json({ message: "All questions shuffled" });
});

/* ================= AD CONTENT MANAGEMENT ================= */
router.get("/ad-content", async (req, res) => {
  try {
    let adContent = await AdContent.findOne();
    if (!adContent) {
      adContent = await AdContent.create({
        product1Title: "",
        product1Image: "",
        product1Price: "",
        product1Description: "",
        product1Link: "",
        product2Title: "",
        product2Image: "",
        product2Price: "",
        product2Description: "",
        product2Link: "",
        tipsTitle: "Quick Tips & Notifications",
        tipsText: "Practice regularly to improve your accuracy",
        quickTip1: "",
        quickTip2: "",
        quickTip3: ""
      });
    }
    res.json(adContent);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ad content", error: err.message });
  }
});

router.post("/ad-content", async (req, res) => {
  try {
    const { product1Title, product1Image, product1Price, product1Description, product1Link, product2Title, product2Image, product2Price, product2Description, product2Link, tipsTitle, tipsText, quickTip1, quickTip2, quickTip3 } = req.body;

    let adContent = await AdContent.findOne();
    if (!adContent) {
      adContent = new AdContent(req.body);
    } else {
      // Update only provided fields
      Object.keys(req.body).forEach(key => {
        adContent[key] = req.body[key];
      });
      adContent.updatedAt = new Date();
    }

    await adContent.save();
    res.json({ message: "Ad content saved successfully", adContent });
  } catch (err) {
    res.status(500).json({ message: "Error saving ad content", error: err.message });
  }
});

/* ================= DELETE AD PRODUCT ================= */
router.delete("/ad-content/product/:product", async (req, res) => {
  try {
    const { product } = req.params;
    if (!["product1", "product2"].includes(product)) {
      return res.status(400).json({ message: "Invalid product identifier" });
    }

    let adContent = await AdContent.findOne();
    if (!adContent) {
      return res.status(404).json({ message: "Ad content not found" });
    }

    // Clear all fields for the product
    adContent[`${product}Title`] = "";
    adContent[`${product}Image`] = "";
    adContent[`${product}Price`] = "";
    adContent[`${product}Description`] = "";
    adContent[`${product}Link`] = "";
    adContent.updatedAt = new Date();

    await adContent.save();
    res.json({ message: `${product} deleted successfully`, adContent });
  } catch (err) {
    res.status(500).json({ message: "Error deleting ad product", error: err.message });
  }
});

export default router;
