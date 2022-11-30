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

router.put("/:id/edit/", isAuth, upload.single("avatar"), ProfileController.edit);
router.get("/:id/audio", isAuth, ProfileController.getAudio);
router.get("/:id/playlists", isAuth, ProfileController.getPlaylists);
router.get("/:id", ProfileController.getOne);
router.get("/:id/favorites", isAuth, ProfileController.getFavorites);

module.exports = router;