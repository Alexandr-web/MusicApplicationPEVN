import jwtDecode from "jwt-decode";

const User = require("../models/User");

/**
 * This middleware checks if the user is logged in
 * Checks if there is an Authorization and a valid token
 */
module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (auth) {
      const token = /^Bearer\s/.test(auth) ? auth.replace(/^Bearer\s/, "") : "";

      if (token) {
        const dataToken = await jwtDecode(token);
        const candidate = await User.findOne({ where: { id: dataToken.id, }, });

        req.isAuth = Boolean(candidate);
        req.userId = dataToken.id;
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
