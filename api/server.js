import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "../config/db.js";
import { startAutoGeneration } from "../utils/autoGenerator.js";

dotenv.config();
// Connect to database
db();
const authRoutes = await import("../routes/authRoutes.js").then(mod => mod.default);
const adminRoutes = await import("../routes/adminRoutes.js").then(mod => mod.default);
const userRoutes = await import("../routes/userRoutes.js").then(mod => mod.default);

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files if needed (e.g. public folder), but not uploads as we use Cloudinary
// app.use("/uploads", express.static("uploads"));
app.get("/",(req,res)=>{
  res.send("api is running");
})
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.get("/health", (req, res) => {
  res.status(200).send({
    time: new Date().toISOString(),
    status: "OK"
  });
});


if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    startAutoGeneration();
  });
}

export default app;
