const express = require("express");
const router = express.Router();
const DhtData = require("../models/dhtData");

const apiKey = process.env.API_KEY;

//getting all
router.get("/", async (req, res) => {
  const getKey = req.query.api_key;

  lastData = {
    "labels": [],
    "temperature": []
  }

  if (getKey === apiKey) {
    try {
      
      const data = await DhtData.find().limit(24).sort({ readingDate: -1 });
      
      lastData.labels = data.map((item) => (item.readingDate).toLocaleTimeString("pl-PL")).reverse();
      lastData.temperature = data.map((item) => item.temperature).reverse();
      
      //console.log(lastData);
      
      res.header("Access-Control-Allow-Origin", "*");
      res.json(lastData);

    } catch (err) {
      
      res.status(500).json({ message: err.message });
    }
  } else {
    res.json({ message: "The provided API key is invalid" });
  }
});

module.exports = router;
