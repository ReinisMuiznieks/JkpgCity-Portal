// Purpose of the file - define the routes for handling store-related requests,
// such as retrieving all stores and creating a new store, etc
const express = require("express");
// rouer is used to define the routes for the stores endpoint
const router = express.Router();

const {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStoreById,
} = require("../models/Store");

router.get("/", async (req, res) => {
  try {
    const stores = await getAllStores();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const store = await getStoreById(id);

    if (!store) {
      return res.status(404).json({ error: "store not found" });
    }

    res.json(store);
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

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStore = await deleteStoreById(id);
    if (!deletedStore) {
      return res.status(404).json({ error: "store not found" });
    }
    res.json({ message: "store deleted successfully", store: deletedStore });
  } catch (err) {
    console.error("Error deleting store:", err);
    res.status(500).json({ error: "Internal server error" });
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
