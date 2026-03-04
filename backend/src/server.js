const express = require("express");
const { connectDB, database } = require("./db.js");
const { createUserTable } = require("./models/User.js");
const userRoutes = require("./routes/users.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);

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
    res.json(storesResult.rows);
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

// add new store
app.post("/stores", async (req, res) => {
  const { name, url, district } = req.body;
  if (!name || !url || !district) {
    return res
      .status(400)
      .json({ error: "name, url, and district of store are required" });
  }
  try {
    const result = await database.query(
      "INSERT INTO stores (name, url, district) VALUES ($1,$2,$3) RETURNING *",
      [name, url, district]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
});

// edit store
app.put("/stores/:id", async (req, res) => {
  const { id } = req.params;
  const { name, url, district } = req.body;

  if (!name || !url || !district) {
    return res
      .status(400)
      .json({ error: "name, url, and district of store are required" });
  }

  try {
    const result = await database.query(
      `UPDATE stores
    SET name = $1, url = $2, district = $3 
    WHERE id =$4 
    RETURNING *`,
      [name, url, district, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "server error" });
  }
});

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
    await connectDB();
    await createUserTable();
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
