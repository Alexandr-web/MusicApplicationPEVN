const { Song, } = require("../models/index");

class Audio {
  async getOne(req, res) {
    try {
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
      const songs = await Song.findAll();

      return res.status(200).json({ ok: true, songs, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }
}

module.exports = new Audio();