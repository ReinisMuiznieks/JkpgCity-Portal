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

// Change to /store/edit/:id to handle dynamic store editing after implementing backend,
// now 1 is used as a placeholder to represent store ID
app.get("/store/edit/1", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "pages", "store-form", "store-form.html"),
  );
});

app.get("/store/new", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "pages", "store-form", "store-form.html"),
  );
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "login", "login.html"));
});

app.listen(port, () => {
  console.log(`Frontend server running at http://localhost:${port}`);
});
