const express = require("express");
const router = express.Router();
const DhtData = require("../models/dhtData.js");
const moment = require("moment");

router.get("/", async (req, res) => {
  try {
    const data = await DhtData.find().limit(24).sort({ readingDate: -1 });
    const last = await DhtData.findOne().sort({ readingDate: -1 });

    res.header("Access-Control-Allow-Origin", "*");
    res.render("index", {
      data: data,
      last: last,
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
