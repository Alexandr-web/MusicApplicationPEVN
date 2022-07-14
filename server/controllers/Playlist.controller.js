const ModelPlaylist = require("../models/Playlist");
const Song = require("../models/Song");
const removeFile = require("../removeFile");

class Playlist {
  async getOne(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;
      const playlist = await ModelPlaylist.findOne({ where: { id, }, });

      return res.status(200).json({ ok: true, playlist, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

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

  async add(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const playlistData = { ...req.body, userId: req.userId, };
      const songs = await Song.findAll();

      playlistData.audio = songs.filter(({ dataValues: { id, }, }) => req.body.audio.includes(id)).map(({ dataValues, }) => dataValues.id);

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

  async getAudio(req, res) {
    try {
      const { id, } = req.params;
      const songs = await Song.findAll();
      const playlist = await ModelPlaylist.findOne({ where: { id, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Такого плейлиста не существует", });
      }

      const playlistAudio = songs.filter((audio) => playlist.dataValues.audio.includes(audio.dataValues.id));

      return res.status(200).json({ ok: true, audio: playlistAudio, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  async remove(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;
      const playlist = await ModelPlaylist.findOne({ where: { id, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Данного плейлиста не существует", });
      }

      if (playlist.dataValues.userId !== req.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для удаления этого плейлиста", });
      }

      removeFile([__dirname, "../../", "playlistPosters", playlist.poster.replace(/^\/\_nuxt\/playlistPosters\//, "")], res);

      await playlist.destroy();

      return res.status(200).json({ ok: true, message: "Плейлист удален", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  async edit(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id: playlistId, } = req.params;
      const playlist = await ModelPlaylist.findOne({ where: { id: playlistId, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Данного плейлиста не существует", });
      }

      if (req.userId !== playlist.dataValues.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для изменения этого плейлиста", });
      }

      const { audio, } = req.body;
      const updates = { ...req.body, };

      if (req.file) {
        updates.poster = req.file.filename;

        removeFile([__dirname, "../../", "playlistPosters", playlist.poster.replace(/^\/\_nuxt\/playlistPosters\//, "")], res);
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