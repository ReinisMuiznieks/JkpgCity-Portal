// Purpose of the file - define the routes for handling store-related requests,
// such as retrieving all stores and creating a new store, etc
const express = require("express");
// rouer is used to define the routes for the stores endpoint
const router = express.Router();
const { getAllStores, getStoreById, createStore, updateStore } = require("../models/Store");

router.get("/", async (req, res) => {
  try {
    const stores = await getAllStores();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/stores/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getStoreById(id);

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

router.post("/", async (req, res) => {
  const { name, url, district } = req.body;
  try {
    const store = await createStore(name, url, district);
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
});

router.put("/stores/:id", async (req, res) => {
  const { id } = req.params;
  const { name, url, district } = req.body;

  if (!name || !url || !district) {
    return res
      .status(400)
      .json({ error: "name, url, and district of store are required" });
  }

  try {
    const store = await updateStore(id, name, url, district);
    res.json(store);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
