const { Playlist: ModelPlaylist, Song, } = require("../models/index");
const fs = require("fs");
const path = require("path");

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
        return res.status(403).json({ ok: false, message: "Для выполнения данной операции необходимо осуществить ее на аккаунте, у которого хотите удалить плейлист", });
      }

      const filePath = path.resolve(__dirname, "../../", "playlistPosters", playlist.poster.replace(/^\/\_nuxt\/playlistPosters\//, ""));

      if (await fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);

            return res.status(500).json({ ok: false, message: "Произошла ошибка при удалении фото", });
          }
        });
      }

      await playlist.destroy();

      return res.status(200).json({ ok: true, message: "Плейлист был удален", });
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

      const { audio, } = req.body;
      const updates = { ...req.body, };

      if (req.file) {
        updates.poster = req.file.filename;

        const filePath = path.resolve(__dirname, "../../", "playlistPosters", playlist.poster.replace(/^\/\_nuxt\/playlistPosters\//, ""));

        if (await fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);

              return res.status(500).json({ ok: false, message: "Произошла ошибка при удалении фото", });
            }
          });
        }
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