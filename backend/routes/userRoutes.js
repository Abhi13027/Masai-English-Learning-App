const express = require("express");
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
} = require("../controllers/userController");

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/profile", getUserProfile);

module.exports = router;
