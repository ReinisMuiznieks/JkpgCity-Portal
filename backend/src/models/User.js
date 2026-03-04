const { database } = require("../db");

async function createUserTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255)
    );
  `;
  await database.query(createTableQuery);
  console.log('Table "users" created or already exists');
}

async function getAllUsers() {
  const result = await database.query("SELECT * FROM users");
  return result.rows;
}

async function getUserById(id) {
  const result = await database.query("SELECT * FROM users WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
}

async function createUser(username, email, password) {
  const result = await database.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await database.query(
    "SELECT id, username, email, password FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

module.exports = {
  createUserTable,
  getAllUsers,
  getUserById,
  createUser,
  findUserByEmail,
};
