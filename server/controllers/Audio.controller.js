const Song = require("../models/Song");
const User = require("../models/User");
const Playlist = require("../models/Playlist");
const removeFile = require("../removeFile");

class Audio {
  async getOne(req, res) {
    try {
      if (!req.isAuth) {
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

      return res.status(200).json({ ok: true, audio: songs, });
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

  async remove(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id: audioId, } = req.params;
      const song = await Song.findOne({ where: { id: audioId, }, });

      if (!song) {
        return res.status(404).json({ ok: false, message: "Данной аудиозаписи не существует", });
      }

      if (req.userId !== song.dataValues.userId) {
        return res.status(403).json({ ok: false, message: "У вас нет прав для удаления этой аудиозаписи", });
      }

      const allPlaylists = await Playlist.findAll();
      const playlistsByAudio = allPlaylists.filter(({ audio, }) => audio.includes(audioId));

      if (playlistsByAudio.length) {
        playlistsByAudio.map(async ({ id, }) => {
          const playlist = await Playlist.findOne({ where: { id, }, });
          const updateAudioId = playlist.audio.filter((identificator) => identificator !== audioId);

          await playlist.update({ audio: updateAudioId, });
        });
      }

      const files = [song.poster, song.audio];

      files.map((file) => {
        removeFile([__dirname, "../../", "audio", file.replace(/^\/\_nuxt\/audio\//, "")], res);
      });

      await song.destroy();

      return res.status(200).json({ ok: true, message: "Аудиозапись удалена", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  async setFavorite(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const { id: audioId, } = req.params;
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

  async getFavorite(req, res) {
    try {
      if (!req.isAuth) {
        return res.status(403).json({ ok: false, message: "Для выполнения данной оперции нужно авторизоваться", });
      }

      const allAudio = await Song.findAll();
      const favoriteAudio = allAudio.filter(({ dataValues: { likes, }, }) => likes.includes(req.userId));

      return res.status(200).json({ ok: true, audio: favoriteAudio, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }
}

module.exports = new Audio();