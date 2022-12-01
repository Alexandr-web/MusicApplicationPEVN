const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

const Playlist = sequelize.define("playlist", {
  name: {
    type: DataTypes.STRING,
    required: true,
  },
  poster: {
    type: DataTypes.TEXT,
    required: true,
  },
  audio: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, { tableName: "playlist", });

module.exports = Playlist;