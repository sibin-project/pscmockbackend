import express from "express";
import cors from "cors";
import path from "path";
import db from "./config/db.js";
import { time } from "console";

// Connect to database
db();
const authRoutes = await import("./routes/authRoutes.js").then(mod => mod.default);
const adminRoutes = await import("./routes/adminRoutes.js").then(mod => mod.default);
const userRoutes = await import("./routes/userRoutes.js").then(mod => mod.default);

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

// Serve uploaded files with proper headers
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
}, express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.get("/health", (req, res) => {
  res.status(200).send({
    time: new Date().toISOString(),
    status: "OK"
  });
});
app.listen(process.env.PORT,() => {
  console.log("Server running ");
});
