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

router.get("/:id", isAuth, PlaylistController.getOne);
router.get("/", isAuth, PlaylistController.getAll);
router.get("/:id/audio", PlaylistController.getAudio);
router.get("/:id/edit", isAuth, PlaylistController.getDataForEditPlaylist);
router.post("/add", isAuth, upload.single("poster"), PlaylistController.add);
router.put("/:id/edit", isAuth, upload.single("poster"), PlaylistController.edit);
router.delete("/:id/remove", isAuth, PlaylistController.remove);

module.exports = router;