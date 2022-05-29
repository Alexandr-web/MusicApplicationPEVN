import jwtDecode from "jwt-decode";

const { User, } = require("../models/index");

export default async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (auth) {
      const token = auth.replace(/^Bearer /, "");

      if (token) {
        const { dataValues, } = await jwtDecode(token);
        const candidate = await User.findOne({ where: { id: dataValues.id, }, });

        req.isAuth = Boolean(candidate);
        req.userId = dataValues.id;
      } else {
        req.isAuth = false;
      }
    } else {
      req.isAuth = false;
    }

    next();
  } catch (err) {
    console.log(err);

    return res.status(500).json({ ok: false, message: "Произошла ошибка сервера", });
  }
};