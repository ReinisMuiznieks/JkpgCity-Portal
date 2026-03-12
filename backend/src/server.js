const express = require("express");
// cors is used to allow cross-origin requests from the frontend
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const { connectDB, database } = require("./db.js");
const { createUserTable } = require("./models/User.js");
const { createStore, createStoreTable } = require("./models/Store.js");
const userRoutes = require("./routes/users.js");
const storeRoutes = require("./routes/stores.js");

const app = express();

const SECRET = "jkpgcity-secret-cookie-token";

app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(cookieParser(SECRET));
// parses incoming JSON requests and makes the data available in req.body
app.use(express.json());
// parses incoming URL-encoded requests (form submissions) and makes the data available in req.body
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/stores", storeRoutes);

// async because we need to read the file and insert into the database,
// which are both async operations because of the database connection and
// file system access. We want to ensure the server starts only after the stores are
// loaded to avoid any issues with missing data when the frontend tries to access the stores.
async function loadStoresFromJson() {
  try {
    //check if there is any stores already to avoid duplicates
    const existingStores = await database.query("SELECT COUNT(*) FROM stores");
    if (existingStores.rows[0].count > 0) {
      console.log("Stores already exist in database, skipping import.");
      return;
    }

    // gets filepath relative to the current file (src/server.js) and points to src/stores.json
    const filePath = path.join(__dirname, "./stores.json");

    // gives filepath and encoding
    const rawData = fs.readFileSync(filePath, "utf8");
    const stores = JSON.parse(rawData);

    //loop through the array and insert each store
    for (const store of stores) {
      await createStore(store.name, store.url, store.district);
    }
    console.log("Successfully loaded stores from src/stores.json!");
  } catch (err) {
    console.error("Error loading stores from file:", err);
  }
}

const startServer = async () => {
  try {
    await connectDB();
    await createUserTable();
    await createStoreTable();
    await loadStoresFromJson();
  } catch (err) {
    console.error("Connection error", err.stack);
  }
  app.listen(3000, () => {
    console.log("JkpgCity Portal backend listening on port 3000!");
  });
};

startServer();
