const express = require("express");
const router = express.Router();
const PlaylistController = require("../controllers/Playlist.controller");
const isAuth = require("../middleware/isAuth");
const serverIsTooBusy = require("../middleware/serverIsTooBusy");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "playlistPosters");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });
const addLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: "Слишком много попыток добавления плейлиста. Повторите еще раз через 30 минут",
});
const editLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: "Слишком много попыток изменения плейлиста. Повторите еще раз через 30 минут",
});
const removeLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: "Слишком много попыток удаления плейлиста. Повторите еще раз через 30 минут",
});

router.get("/:id", serverIsTooBusy, isAuth, PlaylistController.getOne);
router.get("/", serverIsTooBusy, isAuth, PlaylistController.getAll);
router.get("/:id/audio", serverIsTooBusy, PlaylistController.getAudio);
router.get("/:id/edit", serverIsTooBusy, isAuth, PlaylistController.getDataForEditPlaylist);
router.post("/add", addLimit, serverIsTooBusy, isAuth, upload.single("poster"), PlaylistController.add);
router.put("/:id/edit", editLimit, serverIsTooBusy, isAuth, upload.single("poster"), PlaylistController.edit);
router.delete("/:id/remove", removeLimit, serverIsTooBusy, isAuth, PlaylistController.remove);

module.exports = router;