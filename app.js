const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const router = require("./routes/routes");
require("./db/sequelize");

dotenv.config();

const app = express();


// middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(helmet());

// Using Routes
app.use("/api", router);

module.exports = app;
