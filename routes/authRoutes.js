import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || "user" });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log("Register error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Google Login
router.post("/google-login", async (req, res) => {
  try {
    const { email, name, photoURL } = req.body;

    // Enforce @gmail.com domain
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Only @gmail.com email addresses are allowed." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with random password
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        name: name || "Google User",
        email,
        password: hashedPassword,
        role: "user"
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    console.log("Google Login Error:", err);
    res.status(500).json({ message: "Google Login Failed", error: err.message });
  }
});

export default router;