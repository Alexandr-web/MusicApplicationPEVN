const { Playlist: ModelPlaylist, Song, } = require("../models/index");

class Playlist {
  async getOne(req, res) {
    try {
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
        res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
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
}

module.exports = new Playlist();