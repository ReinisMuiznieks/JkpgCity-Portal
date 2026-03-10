const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const sessions = require("../sessions.js");
const {
  createUser,
  findUserByEmail,
} = require("../models/User.js");

// This route returns the currently authenticated user's information based on the session token in the signed cookies.
// It checks if the token is valid and if so, responds with the user's id and email.
// If not authenticated, it returns a 401 Unauthorized error.
// It is used by the frontend to check if the user is logged in and to get their info for display purposes.
router.get("/me", (req, res) => {
  const token = req.signedCookies.authToken;
  const session = token && sessions[token];
  if (!session) return res.status(401).json({ error: "Unauthorized" });
  res.json({ id: session.userId, email: session.email });
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
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
    const token = crypto.randomBytes(64).toString("hex");
    sessions[token] = { userId: user.id, email: user.email };
    res.cookie("authToken", token, { signed: true, httpOnly: true });
    res.json({
      message: "Login Successful",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  const token = req.signedCookies.authToken;
  if (token) delete sessions[token];
  res.clearCookie("authToken");
  res.json({ message: "Logged out" });
});

module.exports = router;
