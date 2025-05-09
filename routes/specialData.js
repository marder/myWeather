const express = require("express");
const router = express.Router();
const Data = require("../models/Data");

const apiKey = process.env.API_KEY;

//getting all
router.get("/", async (req, res) => {
  const getKey = req.query.api_key;

  lastData = {
    "labels": [],
    "temperature": [],
    "humidity": [],
    "pressure": [],
  }

    try {
      
      const data = await Data.find().limit(24).sort({ readingDate: -1 });
      
      lastData.labels = data.map((item) => (item.readingDate).toLocaleTimeString("pl-PL")).reverse();
      lastData.temperature = data.map((item) => item.temperature).reverse();
      lastData.humidity = data.map((item) => item.humidity).reverse();
      lastData.pressure = data.map((item) => item.pressure).reverse();
            
      res.header("Access-Control-Allow-Origin", "*");
      res.json(lastData);

    } catch (err) {
      
      res.status(500).json({ message: err.message });
    }
});

module.exports = router;
