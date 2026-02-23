const { Client } = require("pg");
const express = require("express");
const app = express();

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "12345",
  database: "postgres",
});

app.get("/all", async (req, res) => {
  try {
    const dbres = await client.query("SELECT * FROM users;");
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
  client
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
  client
    .query(insertQuery, insertValues)
    .then((res) => console.log("Inserted record:", res.rows[0]))
    .catch((err) => console.error("Error inserting record", err.stack));
}

// Change if exists
// const insertValues = ["admin", "admin@gmail.com", "admin"];

const startServer = async () => {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database ");
  } catch (err) {
    console.error("Connection error", err.stack);
  }
  app.listen(3001, () => {
    console.log("Example app listening on port 3000!");
  });
};

startServer();

createTable();
// insertRecord(insertValues);
