// Purpose of the file - define the User model and its associated database operations
const { database } = require("../db");

async function createUserTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255)
    );
  `;
  await database.query(createTableQuery);
  console.log('Table "users" created or already exists');
}

async function createUser(email, password) {
  const result = await database.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
    [email, password]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await database.query(
    "SELECT id, email, password FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

module.exports = {
  createUserTable,
  createUser,
  findUserByEmail,
};
