// Purpose of the file - define the Store model and its associated database operations
const { database } = require("../db");

async function createStoreTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      url VARCHAR(300),
      district VARCHAR(50)
    );
  `;
  await database.query(createTableQuery);
  console.log('Table "stores" created or already exists');
}

async function getAllStores() {
  const result = await database.query("SELECT * FROM stores");
  return result.rows;
}

async function getStoreById(id) {
  const result = await database.query("SELECT * FROM stores WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
}

async function createStore(name, url, district) {
  const result = await database.query(
    "INSERT INTO stores (name, url, district) VALUES ($1, $2, $3) RETURNING *",
    [name, url, district]
  );
  return result.rows[0];
}

async function updateStore(id, name, url, district) {
  const result = await database.query(
    `UPDATE stores SET name = $1, url = $2, district = $3 WHERE id = $4 RETURNING *`,
    [name, url, district, id]
  );
  return result.rows[0];
}

async function deleteStoreById(id) {
  const result = await database.query(
    "DELETE FROM stores WHERE id = $1 RETURNING * ",
    [id]
  );
  return result.rows[0]; //undefined = if nothing was deleted
}

module.exports = {
  createStoreTable,
  getAllStores,
  getStoreById,
  createStore,
  deleteStoreById,
  updateStore,
};
