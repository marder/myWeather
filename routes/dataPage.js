const express = require("express");
const router = express.Router();
const Data = require("../models/Data.js");
const moment = require("moment");

router.get("/", async (req, res) => {
  try {
    const data = await Data.find().limit(24).sort({ readingDate: -1 });
    const last = await Data.findOne().sort({ readingDate: -1 });

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

// router.get("/desc", async (req, res) => {
//   try {
//     res.render("api", {
//       path: req.url,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;
