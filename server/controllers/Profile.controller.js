const Song = require("../models/Song");
const User = require("../models/User");
const Playlist = require("../models/Playlist");
const removeFile = require("../removeFile");
const bcrypt = require("bcrypt");

class Profile {
  // Edits user data
  async edit(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;
      const candidate = await User.findOne({ where: { id, }, });

      // This is where the data that needs to be changed will be stored.
      const updates = {};

      if (!candidate) {
        return res.status(404).json({ ok: false, message: "Данного пользователя не существует", });
      }

      if (req.userId !== parseInt(id)) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для изменения этого аккаунта", });
      }

      const allAudio = await Song.findAll();
      const userAudio = allAudio.filter(({ userId, }) => userId === parseInt(id));

      Object.keys(req.body).map(async (key) => {
        updates[key] = key !== "password" ? req.body[key] : await bcrypt.hash(req.body[key], 7);
      });

      // Check for originality
      if (updates.email) {
        const matchUser = await User.findOne({ where: { email: updates.email, }, });

        if (matchUser && matchUser.id !== parseInt(id)) {
          return res.status(400).json({ ok: false, message: "Пользователь с данным email уже существует", });
        }
      }

      if (updates.name) {
        userAudio.map(async (audio) => {
          await audio.update({ author: updates.name, });
          await audio.save();
        });
      }

      if (req.file) {
        updates.avatar = req.file.filename;

        removeFile([__dirname, "../../", "avatars", candidate.avatar.replace(/^\/\_nuxt\/avatars\//, "")], res);
      }

      await candidate.update(updates);
      await candidate.save();

      return res.status(200).json({ ok: true, message: "Данные были изменены", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Getting User Audio
  async getAudio(req, res) {
    try {
      const { id, } = req.params;
      const { favorite, } = req.query;

      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      if (req.userId !== parseInt(id)) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для получения списка аудио другого пользователя", });
      }

      const songs = await Song.findAll();
      const userSongs = songs.filter(({ userId, likes, }) => userId === parseInt(id) || (favorite && likes.includes(parseInt(id))));

      return res.status(200).json({ ok: true, songs: userSongs, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Get user playlists
  async getPlaylists(req, res) {
    try {
      const { id, } = req.params;

      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      if (req.userId !== parseInt(id)) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для получения списка плейлистов другого пользователя", });
      }

      const playlists = await Playlist.findAll();
      const userPlaylists = playlists.filter(({ userId, }) => userId === parseInt(id));

      return res.status(200).json({ ok: true, playlists: userPlaylists, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Getting data to edit a playlist
  async getDataForEditPlaylist(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { playlistId, } = req.params;
      const playlist = await Playlist.findOne({ where: { id: playlistId, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Данного плейлиста не существует", });
      }

      if (req.userId !== playlist.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для получения данных другого пользователя", });
      }

      const allAudio = await Song.findAll();
      const filterAudio = allAudio
        .filter((audio) => audio.userId === req.userId || audio.likes.includes(req.userId) || playlist.audio.includes(audio.id))
        .map((audio) => ({ ...audio.dataValues, have: playlist.audio.includes(audio.id), }));

      return res.status(200).json({ ok: true, audio: filterAudio, playlist, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Getting a user by his id
  async getOne(req, res) {
    try {
      const { id, } = req.params;
      const user = await User.findOne({ where: { id, }, });

      return res.status(200).json({ ok: true, user, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Getting all users
  async getAll(req, res) {
    try {
      const users = await User.findAll();

      return res.status(200).json({ ok: true, users, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Gets the favorite audio
  async getFavorites(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;
      const user = await User.findOne({ where: { id, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", });
      }

      const songs = await Song.findAll();
      const favoritesSongs = songs.filter(({ likes, }) => likes.includes(+id));

      return res.status(200).json({ ok: true, audio: favoritesSongs, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }
}

module.exports = new Profile();