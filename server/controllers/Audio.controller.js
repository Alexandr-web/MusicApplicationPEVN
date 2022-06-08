const { Song, User, Playlist, } = require("../models/index");

class Audio {
  async getOne(req, res) {
    try {
      if (!req.isAuht) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;
      const song = await Song.findOne({ where: { id, }, });

      return res.status(200).json({ ok: true, song, });
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

      const songs = await Song.findAll();

      return res.status(200).json({ ok: true, songs, });
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

      const user = await User.findOne({ where: { id: req.userId, }, });
      const audioData = { ...req.body, author: user.dataValues.name, userId: req.userId, };

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

  async addToPlaylist(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id: playlistId, } = req.params;
      const { audioId, } = req.body;
      const playlist = await Playlist.findOne({ where: { id: playlistId, }, });
      const audio = await Song.findOne({ where: { id: audioId, }, });

      if (!playlist) {
        return res.status(404).json({ ok: false, message: "Такого плейлиста не существует", });
      }

      if (!audio) {
        return res.status(404).json({ ok: false, message: "Такой песни не существует", });
      }

      const copyAudioPlaylist = [...playlist.dataValues.audio];

      if (copyAudioPlaylist.includes(audioId)) {
        await playlist.update({ audio: copyAudioPlaylist.filter((id) => id !== audioId), });

        return res.status(200).json({ ok: true, message: "Аудиозапись удалена из плейлиста", have: false, });
      }

      copyAudioPlaylist.unshift(audioId);

      await playlist.update({ audio: copyAudioPlaylist, });
      await playlist.save();

      return res.status(200).json({ ok: true, message: "Аудиозапись добавлена в плейлист", have: true, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }
}

module.exports = new Audio();