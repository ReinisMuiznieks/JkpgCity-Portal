const express = require("express");
const path = require("path");

const app = express();
const port = 8080;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "pages", "stores", "stores.html"),
  );
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "login", "login.html"));
});

app.listen(port, () => {
  console.log(`Frontend server running at http://localhost:${port}`);
});
