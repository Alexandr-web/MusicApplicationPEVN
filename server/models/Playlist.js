const sequelize = require("../db");
const { DataTypes, } = require("sequelize");

const Playlist = sequelize.define("playlist", {
  name: { type: DataTypes.STRING, },
  poster: { type: DataTypes.TEXT, },
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