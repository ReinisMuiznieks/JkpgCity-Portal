const { Client } = require("pg");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const database = new Client({
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

function createUserTable() {
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

function createStoreTable() {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  url VARCHAR(300),
  district VARCHAR(50)
  );
  `;
  database
    .query(createTableQuery)
    .then(() =>
      console.log('table "stores" created succesfully or already exists')
    )
    .catch((err) => console.error("Error creating table", err.stack));
}

// route to get all stores
app.get("/stores", async (req, res) => {
  try {
    const storesResult = await database.query("SELECT * FROM stores;");
    console.log("All stores:", storesResult.rows);
  } catch (err) {
    console.error("Error selecting stores", err.stack);
    res.status(500).json({ error: "internal server error" });
  }
});

//route to get store by id
app.get("/stores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await database.query("SELECT * FROM stores WHERE id=$1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "store not found" });
    }

    // 0 refering to the first and only row for that response
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error selecting stores", err.stack);
    res.status(500).json({ error: "internal server error" });
  }
});

// Only needed for initial user like admin
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Finds user by their email
    const result = await database.query(
      "SELECT id, username, email, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User is not registered" });
    }

    const user = result.rows[0];

    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Login User
    return res.json({
      message: "Login Successful",
      user: { id: user.id, name: username.username, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
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

createStoreTable();
createUserTable();
// insertRecord(insertValues);
