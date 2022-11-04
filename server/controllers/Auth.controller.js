const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class Auth {
  // Registers a user in the system
  async registration(req, res) {
    try {
      const { password, email, name, } = req.body;
      const userData = Object.keys(req.body).reduce((acc, key) => {
        if (!["password", "avatar"].includes(key)) {
          acc[key] = req.body[key];
        }

        return acc;
      }, {});

      const candidateWithEmail = await User.findOne({ where: { email, }, });
      const candidateWithName = await User.findOne({ where: { name, }, });

      if (candidateWithName || candidateWithEmail) {
        return res.status(400).json({ ok: false, message: "Такой пользователь уже существует", });
      }

      // Hashing the password
      const hashPassword = await bcrypt.hash(password, 7);
      const avatar = req.file.filename;

      await User.create({ ...userData, password: hashPassword, avatar, });

      return res.status(200).json({ ok: true, message: "Пользователь зарегистрирован", });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }

  // Authorizes the user
  async login(req, res) {
    try {
      const { email, password, } = req.body;
      const candidate = await User.findOne({ where: { email, }, });

      if (!candidate) {
        return res.status(404).json({ ok: false, message: "Такого пользователя не существует", });
      }

      const isTruePassword = await bcrypt.compare(password, candidate.password);

      if (!isTruePassword) {
        return res.status(400).json({ ok: false, message: "Неверный пароль", });
      }

      const token = jwt.sign({ ...candidate, }, process.env.SECRET_KEY, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60), });

      return res.status(200).json({ ok: true, message: "Вход выполнен успешно", token: `Bearer ${token}`, });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
    }
  }
}

module.exports = new Auth();