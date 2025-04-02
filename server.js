require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database..."));

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 10 * 60 * 1000, // 1 minute
  max: 50,
  validate: { xForwardedForHeader: false },
});

app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.set("view engine", "ejs");

// Apply rate limiter to all requests
app.use(limiter);

app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

const dataRouter = require("./routes/dhtData");
app.use("/dhtData", dataRouter);

const dataPage = require("./routes/dataPage");
app.use("/", dataPage);

// app.get("/", (req, res) => {
//   res.json({ message: "Stay awhile and listen" });
// });

app.listen(port, () =>
  console.log("Server listening on PORT", port, `\nhttp://localhost:${port}/`)
);
