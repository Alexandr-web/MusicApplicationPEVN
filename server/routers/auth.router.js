const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");
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

router.post("/registration", upload.single("avatar"), AuthController.registration);
router.post("/login", AuthController.login);
router.get("/users", AuthController.getAll);
router.get("/users/:id", AuthController.getOne);

module.exports = router;