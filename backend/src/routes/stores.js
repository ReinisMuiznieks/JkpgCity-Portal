const express = require("express");
const router = express.Router();
const { getAllStores, getStoreById, createStore } = require("../models/Store");

router.get("/", async (req, res) => {
    try {
        const stores = await getAllStores();
        res.json(stores)
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
});

router.post("/", async (req, res) => {
    const {name, url, district } = req.body;
    try {
        const store = await createStore(name, url, district);
        res.status(201).json(store);
    } catch (err) {
        res.status(500).json({ error: "internal server error" });
    }
});

module.exports = router;