const ModelPlaylist = require("../models/Playlist");
const Song = require("../models/Song");
const removeFile = require("../removeFile");

class Playlist {
  // Getting data to edit a playlist
  async getDataForEditPlaylist(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const playlist = await ModelPlaylist.findOne({ where: { id, }, });

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

  // Getting a playlist by its id
  async getOne(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const playlist = await ModelPlaylist.findOne({ where: { id, }, });

      return res.status(200).json({ ok: true, playlist, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Getting all playlists
  async getAll(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const playlists = await ModelPlaylist.findAll();

      return res.status(200).json({ ok: true, playlists, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Adding a playlist to a user
  async add(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const body = req.body;
      const keysBody = Object.keys(body);
      const requiredData = ["name", "poster", "audio"];

      if (!keysBody.length || !keysBody.every((key) => requiredData.includes(key))) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const playlistData = { ...body, userId: req.userId, };
      const songs = await Song.findAll();

      playlistData.audio = songs.filter(({ id, }) => body.audio.includes(id)).map(({ id, }) => id);

      if (req.file) {
        playlistData.poster = req.file.filename;
      }

      await ModelPlaylist.create(playlistData);

      return res.status(200).json({ ok: true, message: "Плейлист добавлен", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Get this playlist's audio
  async getAudio(req, res) {
    try {
      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const songs = await Song.findAll();
      const playlist = await ModelPlaylist.findOne({ where: { id, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Такого плейлиста не существует", });
      }

      const playlistAudio = songs.filter((audio) => playlist.audio.includes(audio.id));

      return res.status(200).json({ ok: true, audio: playlistAudio, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Deleting a user's playlist
  async remove(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;

      if (!id || isNaN(+id)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const playlist = await ModelPlaylist.findOne({ where: { id, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Данного плейлиста не существует", });
      }

      if (playlist.userId !== req.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для удаления этого плейлиста", });
      }

      removeFile([__dirname, "../../", "playlistPosters", playlist.poster], res);

      await playlist.destroy();

      return res.status(200).json({ ok: true, message: "Плейлист удален", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Playlist editing
  async edit(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id: playlistId, } = req.params;
      const body = req.body;
      const keysBody = Object.keys(body);
      const requiredData = ["name", "poster", "audio"];

      if ([!playlistId, isNaN(+playlistId), !keysBody.length, !keysBody.some((key) => requiredData.includes(key))].some(Boolean)) {
        return res.status(400).json({ ok: false, message: "Некорректные данные", });
      }

      const playlist = await ModelPlaylist.findOne({ where: { id: playlistId, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Данного плейлиста не существует", });
      }

      if (req.userId !== playlist.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для изменения этого плейлиста", });
      }

      const updates = body;
      const { audio, } = updates;

      if (req.file) {
        updates.poster = req.file.filename;

        removeFile([__dirname, "../../", "playlistPosters", playlist.poster], res);
      }

      updates.audio = JSON.parse(audio);

      await playlist.update(updates);

      return res.status(200).json({ ok: true, message: "Плейлист изменен", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }
}

module.exports = new Playlist();