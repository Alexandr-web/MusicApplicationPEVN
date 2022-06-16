const { User, Song, Playlist, } = require("../models/index");
const removeFile = require("../removeFile");
const bcrypt = require("bcrypt");

class Profile {
  async edit(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id, } = req.params;
      const candidate = await User.findOne({ where: { id, }, });
      const updates = {};

      if (!candidate) {
        return res.status(404).json({ ok: false, message: "Данного пользователя не существует", });
      }

      if (req.userId !== +id) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для изменения этого аккаунта", });
      }

      Object.keys(req.body).map(async (key) => {
        updates[key] = key !== "password" ? req.body[key] : await bcrypt.hash(req.body[key], 7);
      });

      if (updates.email) {
        const matchUser = await User.findOne({ where: { email: updates.email, }, });

        if (matchUser && matchUser.dataValues.id !== +id) {
          return res.status(400).json({ ok: false, message: "Пользователь с данным email уже существует", });
        }
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

  async getAudio(req, res) {
    try {
      const { id, } = req.params;

      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      if (req.userId !== +id) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для получения списка аудио другого пользователя", });
      }

      const songs = await Song.findAll();
      const userSongs = songs.filter(({ dataValues, }) => dataValues.userId === +id);

      return res.status(200).json({ ok: true, songs: userSongs, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  async getPlaylists(req, res) {
    try {
      const { id, } = req.params;

      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      if (req.userId !== +id) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для получения списка плейлистов другого пользователя", });
      }

      const playlists = await Playlist.findAll();
      const userPlaylists = playlists.filter(({ dataValues, }) => dataValues.userId === +id);

      return res.status(200).json({ ok: true, playlists: userPlaylists, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

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

      if (req.userId !== playlist.dataValues.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет доступа для получения данных другого пользователя", });
      }

      const allAudio = await Song.findAll();
      const filterAudio = allAudio.filter((audio) => {
        if (audio.dataValues.userId === req.userId) {
          audio.dataValues.have = playlist.dataValues.audio.includes(audio.dataValues.id);

          return audio;
        }
      });

      return res.status(200).json({ ok: true, audio: filterAudio, playlist, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }
}

module.exports = new Profile();