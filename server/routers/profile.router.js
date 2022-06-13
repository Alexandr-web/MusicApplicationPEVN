const express = require("express");
const isAuth = require("../middleware/isAuth");
const router = express.Router();
const ProfileController = require("../controllers/Profile.controller");
const multer = require("multer");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "avatars");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, });

router.put("/edit/:id", isAuth, upload.single("avatar"), ProfileController.edit);
router.get("/api/:id/audio", isAuth, ProfileController.getAudio);
router.get("/api/:id/playlists", isAuth, ProfileController.getPlaylists);
router.get("/api/:userId/edit/playlist/:playlistId", isAuth, ProfileController.getDataForEditPlaylist);

module.exports = router;