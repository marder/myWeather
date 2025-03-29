const express = require("express");
const router = express.Router();
const PageData = require("../models/dhtData.js");

router.get("/", async (req, res) => {
  try {
    res.render("index", {
      path: req.url,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/apidesc", async (req, res) => {
  try {
    res.render("api", {
      path: req.url,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
