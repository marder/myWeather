const express = require("express");
const router = express.Router();
const Data = require("../models/Data");

const apiKey = process.env.API_KEY;
const apiKeyPost = process.env.API_KEY_POST;

//getting all
router.get("/", async (req, res) => {
    try {
      const data = await Data.find();
      //console.log(data);
      res.header("Access-Control-Allow-Origin", "*");
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

//getting pages
router.get("/pages", paginatedResults(Data), (req, res) => {
  res.json(res.paginatedResults);
});

//getting one
router.get("/:id", getData, (req, res) => {
    console.log(req.protocol + "://" + req.headers.host + req.originalUrl);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(res.data);
});

//creating one
router.post("/", async (req, res) => {
  const postKey = req.query.api_key;
  if (postKey === apiKeyPost) {
    const data = new Data({
      description: req.body.description,
      temperature: req.body.temperature,
      humidity: req.body.humidity,
      pressure: req.body.pressure
    });
    try {
      const newData = await data.save();
      res.status(201).json(newData);
      console.log(req.baseUrl);
      console.log(newData);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.json({ message: "The provided api key is invalid" });
  }
});

async function getData(req, res, next) {
  let data;
  try {
    data = await Data.findById(req.params.id);
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
        (await Data.find().countDocuments().exec()) / limit
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
