const express = require("express");
const isAuth = require("../middleware/isAuth");
const router = express.Router();
const ProfileController = require("../controllers/Profile.controller");
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
const editLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Слишком много попыток изменения данных пользователя. Повторите еще раз через 30 минут",
      type: "error",
      ok: false,
    });
  },
});

router.put("/:id/edit/", editLimit, serverIsTooBusy, isAuth, upload.single("avatar"), ProfileController.edit);
router.get("/:id/audio", serverIsTooBusy, isAuth, ProfileController.getAudio);
router.get("/:id/playlists", serverIsTooBusy, isAuth, ProfileController.getPlaylists);
router.get("/:id", serverIsTooBusy, ProfileController.getOne);
router.get("/:id/favorites", serverIsTooBusy, isAuth, ProfileController.getFavorites);

module.exports = router;