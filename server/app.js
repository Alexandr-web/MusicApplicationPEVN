import host from "./host";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./db");
const authRoute = require("./routers/auth.router");

require("dotenv").config();
require("./models/index");

app.use(cors({ origin: [host], }));
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("Connection has been established successfully.");
  } catch (err) {
    console.log(err);
  }
};

connectToDatabase();

app.use("/auth", authRoute);

module.exports = app;