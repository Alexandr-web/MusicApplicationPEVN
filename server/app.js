const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./db");
const host = require("./host");

const authRoute = require("./routers/auth.router");
const profileRoute = require("./routers/profile.router");
const audioRoute = require("./routers/audio.router");
const playlistRoute = require("./routers/playlist.router");

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

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/audio", audioRoute);
app.use("/api/playlist", playlistRoute);

module.exports = app;