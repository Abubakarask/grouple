const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/routes");

dotenv.config();

const app = express();

// middlewares
app.use(express.json());

// Using Routes
app.use("/api", router);

module.exports = app;