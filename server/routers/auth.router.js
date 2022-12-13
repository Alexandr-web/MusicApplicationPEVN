const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");
const multer = require("multer");
const serverIsTooBusy = require("../middleware/serverIsTooBusy");
const rateLimit = require("express-rate-limit");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "avatars");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });
const registrationLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Слишком много попыток регистрации. Повторите еще раз через 1 час",
});
const loginLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: "Слишком много попыток входа. Повторите еще раз через 30 минут",
});

router.post("/registration", registrationLimit, serverIsTooBusy, upload.single("avatar"), AuthController.registration);
router.post("/login", loginLimit, serverIsTooBusy, AuthController.login);

module.exports = router;