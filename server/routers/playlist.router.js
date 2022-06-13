const express = require("express");
const router = express.Router();
const PlaylistController = require("../controllers/Playlist.controller");
const isAuth = require("../middleware/isAuth");
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

router.get("/api/:id", isAuth, PlaylistController.getOne);
router.get("/api", isAuth, PlaylistController.getAll);
router.get("/api/:id/audio", PlaylistController.getAudio);
router.post("/add", isAuth, upload.single("poster"), PlaylistController.add);
router.put("/edit/:id", isAuth, upload.single("poster"), PlaylistController.edit);
router.delete("/:id/remove", isAuth, PlaylistController.remove);

module.exports = router;