const express = require("express");
const router = express.Router();
const DhtData = require("../models/dhtData");

const apiKey = process.env.API_KEY;
const apiKeyPost = process.env.API_KEY_POST;

// //getting all
// router.get("/", async (req, res) => {
//   const getKey = req.query.api_key;
//   if (getKey === apiKey) {
//     try {
//       const data = await DhtData.find();
//       //console.log(data);
//       res.header("Access-Control-Allow-Origin", "*");
//       res.json(data);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   } else {
//     res.json({ message: "The provided API key is invalid" });
//   }
// });

//getting pages
router.get("/pages", paginatedResults(DhtData), (req, res) => {
  res.json(res.paginatedResults);
});

//getting one
router.get("/:id", getDhtData, (req, res) => {
  const getKey = req.query.api_key;
  if (getKey === apiKey) {
    console.log(req.protocol + "://" + req.headers.host + req.originalUrl);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(res.data);
  } else {
    res.json({ message: "The provided api key is invalid" });
  }
});

//creating one
router.post("/", async (req, res) => {
  const postKey = req.query.api_key;
  if (postKey === apiKeyPost) {
    const data = new DhtData({
      description: req.body.description,
      temperature: req.body.temperature,
      humidity: req.body.humidity,
      pressure: req.body.pressure
    });
    try {
      const newDhtData = await data.save();
      res.status(201).json(newDhtData);
      console.log(req.baseUrl);
      console.log(newDhtData);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.json({ message: "The provided api key is invalid" });
  }
});

async function getDhtData(req, res, next) {
  let data;
  try {
    data = await DhtData.findById(req.params.id);
    if (data == null) {
      return res.status(404).json({ message: "Record not found!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.data = data;
  next();
}

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.find().countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    if (!limit) {
      results.totalPages = 1;
    } else {
      results.totalPages = Math.ceil(
        (await DhtData.find().countDocuments().exec()) / limit
      );
    }
    try {
      results.results = await model
        .find()
        .limit(limit)
        .skip(startIndex)
        .exec();

      res.paginatedResults = results;
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

module.exports = router;
