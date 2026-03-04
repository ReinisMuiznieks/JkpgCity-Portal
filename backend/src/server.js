const { Database } = require("pg");
const express = require("express");
const app = express();

const database = new Database({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "12345",
  database: "postgres",
});

app.get("/all", async (req, res) => {
  try {
    const dbres = await database.query("SELECT * FROM users;");
    console.log("All users:", dbres.rows);
    res.json(dbres.rows);
  } catch (err) {
    console.error("Error selecting records", err.stack);
  }
});

function createTable() {
  const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
username VARCHAR(50),
email VARCHAR(100) UNIQUE,
password VARCHAR(255)
); 
`;
  database
    .query(createTableQuery)
    .then(() => console.log('Table "users" created or already exists'))
    .catch((err) => console.error("Error creating table", err.stack));
}

function insertRecord(insertValues) {
  const insertQuery = `
INSERT INTO users (username, email, password)
VALUES ($1, $2, $3)
RETURNING *;
`;
  database
    .query(insertQuery, insertValues)
    .then((res) => console.log("Inserted record:", res.rows[0]))
    .catch((err) => console.error("Error inserting record", err.stack));
}

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email, and password are required" });
  }
  try {
    const result = await database.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, password]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    // postgres error: duplicate key value
    if (err.code === "23505") {
      return res.status(409).json({ error: "user already exists" });
    }
    return res.status(500).json({ error: "internal server error" });
  }
});

// Change if exists
// const insertValues = ["admin", "admin@gmail.com", "admin"];

const startServer = async () => {
  try {
    await database.connect();
    console.log("Connected to PostgreSQL database ");
  } catch (err) {
    console.error("Connection error", err.stack);
  }
  app.listen(3001, () => {
    console.log("Example app listening on port 3001!");
  });
};

startServer();

createTable();
// insertRecord(insertValues);
