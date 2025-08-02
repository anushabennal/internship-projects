const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Course = require("./models/Course");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"));

// Register
app.post("/api/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ message: "Registered Successfully" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(400).json({ error: "Invalid Credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, name: user.name });
});

// Courses
app.get("/api/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Seed some courses if empty
app.get("/api/seed", async (req, res) => {
  const count = await Course.countDocuments();
  if (count === 0) {
    await Course.insertMany([
      { title: "HTML Basics", description: "Learn the basics of HTML" },
      { title: "CSS Fundamentals", description: "Style your websites" },
      { title: "JavaScript 101", description: "Add interactivity" }
    ]);
  }
  res.json({ message: "Courses Seeded" });
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
