import mongoose from "mongoose";
import dotenv from "dotenv";
import db from "./config/db.js";
import Question from "./models/question.js";

dotenv.config();

const seedDB = async () => {
    try {
        await db();

        await Question.deleteMany({});
        console.log("Deleted existing questions");

        // console.log("Inserting new questions...");
        // // Handle nested structure from user copy-paste
        // const questionsToInsert = questions[0].questions || questions;
        // await Question.insertMany(questionsToInsert);

        console.log("✅ Data Cleared Successfully");
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding data:", err);
        process.exit(1);
    }
};

seedDB();
