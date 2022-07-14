const User = require("./User");
const Song = require("./Song");
const Playlist = require("./Playlist");

User.hasMany(Song);
User.hasMany(Playlist);

Song.belongsTo(User);
Playlist.belongsTo(User);

module.exports = {
  Song,
  User,
  Playlist,
};