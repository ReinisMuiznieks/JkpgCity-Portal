// Purpose of the file - establish a connection to the postgres database
// and export the connection for use in other parts of the application
const { Client } = require("pg");

const database = new Client({
  host: "localhost",
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
