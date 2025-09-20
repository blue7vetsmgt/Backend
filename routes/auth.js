const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password, pets } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exist = await User.findOne({ phone });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ name, phone, email, passwordHash, pets });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
