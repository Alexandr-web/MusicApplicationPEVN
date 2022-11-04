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

router.get("/api", isAuth, AudioController.getAll);
router.get("/api/:id", isAuth, AudioController.getOne);
router.post("/add", isAuth, upload.fields([{ name: "audio", maxCount: 1, }, { name: "poster", maxCount: 1, }]), AudioController.add);
router.post("/add/playlist/:id", isAuth, AudioController.addToPlaylist);
router.post("/:id/favorite", isAuth, AudioController.setFavorite);
router.delete("/:id/remove", isAuth, AudioController.remove);

module.exports = router;