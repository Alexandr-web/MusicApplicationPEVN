const express = require("express");
const router = express.Router();
const AudioController = require("../controllers/Audio.controller");
const isAuth = require("../middleware/isAuth");
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

router.get("/", isAuth, AudioController.getAll);
router.post("/add", isAuth, upload.fields([{ name: "audio", maxCount: 1, }, { name: "poster", maxCount: 1, }]), AudioController.add);
router.post("/:id/add/playlist/:playlistId", isAuth, AudioController.addToPlaylist);
router.post("/:id/favorite", isAuth, AudioController.setFavorite);
router.delete("/:id/remove", isAuth, AudioController.remove);

module.exports = router;