import Question from "../models/question.js";
import { generatePSCQuestion } from "./aiService.js";

const CATEGORIES = ["sslc", "plustow", "degree"];
const SUBCATEGORIES = ["history", "geograpy", "maths", "english"];

export const startAutoGeneration = () => {
    console.log("🚀 AI Auto-Generator Initializing...");

    const runGeneration = async () => {
        const timestamp = new Date().toLocaleTimeString();
        try {
            const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
            const randomSubcategory = SUBCATEGORIES[Math.floor(Math.random() * SUBCATEGORIES.length)];
            
            console.log(`[${timestamp}] 🤖 AI Starting Generation: ${randomCategory.toUpperCase()} - ${randomSubcategory.toUpperCase()}`);
            
            const aiQ = await generatePSCQuestion(randomCategory, randomSubcategory);
            
            const finalCorrectVal = aiQ.options[aiQ.correctAnswer] || aiQ.correctAnswer;
            
            const newQuestion = new Question({
                question: aiQ.question,
                options: aiQ.options,
                correctAnswer: finalCorrectVal,
                category: aiQ.category || randomCategory,
                subcategory: aiQ.subcategory || randomSubcategory,
                explanation: aiQ.explanation || "",
                isApproved: true
            });

            await newQuestion.save();
            console.log(`[${timestamp}] ✅ Question Saved: "${aiQ.question.substring(0, 40)}..."`);
        } catch (error) {
            console.error(`[${timestamp}] ❌ Auto-gen Error:`, error.message);
        }
    };

    // Run first generation immediately (after 5s delay)
    setTimeout(() => {
        console.log("⚡ Triggering first AI generation...");
        runGeneration();
    }, 5000);

    // Then run every 3 minutes
    setInterval(runGeneration, 3 * 60 * 1000);
};
