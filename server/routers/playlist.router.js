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

router.get("/api/:id", PlaylistController.getOne);
router.get("/api", PlaylistController.getAll);
router.post("/add", isAuth, upload.single("poster"), PlaylistController.add);

module.exports = router;