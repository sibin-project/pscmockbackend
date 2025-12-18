import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = () => mongoose.connect(process.env.MONGO_URI || "mongodb+srv://sibinc36_db_user:ksjd8eCAHGt6soqa@pscmock.ee0n1an.mongodb.net/?appName=pscmock")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
export default db;
