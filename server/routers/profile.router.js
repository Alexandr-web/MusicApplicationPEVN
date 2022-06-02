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
router.get("/api/audio/:id", isAuth, ProfileController.getAudio);
router.get("/api/playlists/:id", isAuth, ProfileController.getPlaylists);

module.exports = router;