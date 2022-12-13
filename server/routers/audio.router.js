const express = require("express");
const router = express.Router();
const AudioController = require("../controllers/Audio.controller");
const isAuth = require("../middleware/isAuth");
const serverIsTooBusy = require("../middleware/serverIsTooBusy");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "audio");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });
const addLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 30,
  message: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Слишком много попыток добавления аудио. Повторите еще раз через 30 минут",
      type: "error",
      ok: false,
    });
  },
});
const removeLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    return res.status(429).json({
      status: 429,
      message: "Слишком много попыток удаления аудио. Повторите еще раз через 30 минут",
      type: "error",
      ok: false,
    });
  },
});

router.get("/", serverIsTooBusy, isAuth, AudioController.getAll);
router.post("/add", addLimit, serverIsTooBusy, isAuth, upload.fields([{ name: "audio", maxCount: 1, }, { name: "poster", maxCount: 1, }]), AudioController.add);
router.post("/:id/add/playlist/:playlistId", serverIsTooBusy, isAuth, AudioController.addToPlaylist);
router.post("/:id/favorite", addLimit, serverIsTooBusy, isAuth, AudioController.setFavorite);
router.delete("/:id/remove", removeLimit, serverIsTooBusy, isAuth, AudioController.remove);

module.exports = router;