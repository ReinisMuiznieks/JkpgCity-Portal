// define and export database connection and connection function
const { Client } = require("pg");

const database = new Client({
  // uses environment variable for host if using docker for backend,
  // otherwise defaults to localhost
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  user: "postgres",
  password: "12345",
  database: "postgres",
});

async function connectDB() {
  await database.connect();
  console.log("Connected to PostgreSQL database");
}

module.exports = { database, connectDB };
