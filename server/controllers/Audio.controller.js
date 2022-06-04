const { Song, User, } = require("../models/index");

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
}

module.exports = new Audio();