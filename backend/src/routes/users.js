const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  findUserByEmail,
} = require("../models/User.js");

router.get("/all", async (req, res) => {
  try {
    const users = await getAllUsers();
    console.log("All users:", users);
    res.json(users);
  } catch (err) {
    console.error("Error selecting records", err.stack);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error selecting user", err.stack);
    res.status(500).json({ error: "internal server error" });
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "email and password required" });
  }
  try {
    const user = await createUser(email, password);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);

    // postgres error: duplicate key value
    if (err.code === "23505") {
      return res.status(409).json({ error: "user already exists" });
    }
    res.status(500).json({ error: "internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({
      message: "Login Successful",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
