const Song = require("../models/Song");
const User = require("../models/User");
const Playlist = require("../models/Playlist");
const removeFile = require("../removeFile");
const { Op, } = require("sequelize");

class Audio {
  // Gets all audios from the database
  async getAll(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(401).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const songs = await Song.findAll();

      return res.status(200).json({ ok: true, audio: songs, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Adds audio to the user
  async add(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(401).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const body = req.body;
      const requiredData = ["name", "author", "audio", "poster", "time", "duration"];
      const bodyKeys = Object.keys(body);

      if (!bodyKeys.length || !bodyKeys.every((key) => requiredData.includes(key))) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const user = await User.findOne({ where: { id: req.userId, }, });
      const audioData = { ...body, author: user.name, userId: req.userId, };

      if (req.files) {
        Object.keys(req.files).map((key) => audioData[key] = req.files[key][0].filename);
      }

      await Song.create(audioData);

      return res.status(200).json({ ok: true, message: "Трек добавлен", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Adds audio to a playlist
  async addToPlaylist(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(401).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { playlistId, id: audioId, } = req.params;

      if ([!playlistId, !audioId, isNaN(+playlistId), isNaN(+audioId)].some(Boolean)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const playlist = await Playlist.findOne({ where: { id: playlistId, }, });
      const audio = await Song.findOne({ where: { id: audioId, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Такого плейлиста не существует", });
      }

      if (!audio) {
        return res.status(404).json({ ok: false, message: "Такой песни не существует", });
      }

      const copyAudioPlaylist = [...playlist.audio];

      if (copyAudioPlaylist.includes(audioId)) {
        await playlist.update({ audio: copyAudioPlaylist.filter((id) => id !== audioId), });

        return res.status(200).json({ ok: true, message: "Аудиозапись удалена из плейлиста", have: false, });
      }

      copyAudioPlaylist.unshift(audioId);

      await playlist.update({ audio: copyAudioPlaylist, });

      return res.status(200).json({ ok: true, message: "Аудиозапись добавлена в плейлист", have: true, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Removes audio from the user
  async remove(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(401).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id: audioId, } = req.params;

      if (!audioId || isNaN(+audioId)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const song = await Song.findOne({ where: { id: audioId, }, });

      if (!song) {
        return res.status(404).json({ ok: false, message: "Данной аудиозаписи не существует", });
      }

      if (req.userId !== song.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет прав для удаления этой аудиозаписи", });
      }

      const allPlaylists = await Playlist.findAll({ where: { audio: { [Op.contains]: [audioId], }, }, });

      if (allPlaylists.length) {
        allPlaylists.map(async ({ id, }) => {
          const playlist = await Playlist.findOne({ where: { id, }, });
          const updateAudioId = playlist.audio.filter((identificator) => identificator !== audioId);

          await playlist.update({ audio: updateAudioId, });
        });
      }

      const files = [song.poster, song.audio];

      files.map((file) => {
        removeFile([__dirname, "../../", "audio", file], res);
      });

      await song.destroy();

      return res.status(200).json({ ok: true, message: "Аудиозапись удалена", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Makes an audio favorite
  async setFavorite(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(401).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id: audioId, } = req.params;

      if (!audioId || isNaN(+audioId)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const audio = await Song.findOne({ where: { id: audioId, }, });

      if (!audio) {
        return res.status(404).json({ ok: false, message: "Данной аудиозаписи не существует", });
      }

      const user = await User.findOne({ where: { id: req.userId, }, });

      if (!user) {
        return res.status(404).json({ ok: false, message: "Данного пользователя не существует", });
      }

      const isAlreadyFavorite = audio.likes.includes(req.userId);
      const copyAudioLikes = [...audio.likes];

      if (isAlreadyFavorite) {
        await audio.update({ likes: copyAudioLikes.filter((id) => id !== req.userId), });

        return res.status(200).json({ ok: true, isFavorite: false, });
      }

      copyAudioLikes.push(req.userId);

      await audio.update({ likes: copyAudioLikes, });

      return res.status(200).json({ ok: true, isFavorite: true, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }
}

module.exports = new Audio();