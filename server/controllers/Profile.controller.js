const Song = require("../models/Song");
const User = require("../models/User");
const Playlist = require("../models/Playlist");
const removeFile = require("../removeFile");
const bcrypt = require("bcrypt");
const { Op, } = require("sequelize");

class Profile {
  // Edits user data
  async edit(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(401).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;
      const body = req.body;
      const keysBody = Object.keys(body);
      const requiredData = ["name", "password", "avatar", "email"];

      if ([!id, isNaN(+id), !keysBody.length, !keysBody.some((key) => requiredData.includes(key))].some(Boolean)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

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

      keysBody.map(async (key) => {
        updates[key] = key !== "password" ? body[key] : await bcrypt.hash(body[key], 7);
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
        });
      }

      if (req.file) {
        updates.avatar = req.file.filename;

        removeFile([__dirname, "../../", "avatars", candidate.avatar], res);
      }

      await candidate.update(updates);

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

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const { favorite, } = req.query;

      if (!req.isAuth) {
        return res.status(401).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      if (req.userId !== parseInt(id)) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для получения списка аудио другого пользователя", });
      }

      const findParams = {
        [Op.or]: favorite ? {
          userId: +id,
          likes: { [Op.contains]: [id], },
        } : false,
        userId: !favorite ? +id : false,
      };

      // We are looking for only those parameters that are true
      const validFindParams = Object
        .keys(findParams)
        .filter((key) => findParams[key])
        .reduce((acc, key) => {
          acc[key] = findParams[key];

          return acc;
        }, {});
      const songs = await Song.findAll({ where: validFindParams, });

      return res.status(200).json({ ok: true, songs, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Get user playlists
  async getPlaylists(req, res) {
    try {
      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      if (!req.isAuth) {
        return res.status(401).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      if (req.userId !== +id) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для получения списка плейлистов другого пользователя", });
      }

      const playlists = await Playlist.findAll({ where: { userId: +id, }, });

      return res.status(200).json({ ok: true, playlists, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Getting a user by his id
  async getOne(req, res) {
    try {
      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const user = await User.findOne({ where: { id, }, });

      return res.status(200).json({ ok: true, user, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Gets the favorite audio
  async getFavorites(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(401).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

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