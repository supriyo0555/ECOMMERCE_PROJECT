const express = require("express");
const {
  registerUser,
  loginUser,
  registerSeller,
  loginSeller,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/seller/register", registerSeller);
router.post("/seller/login", loginSeller);
router.get("/me", protect, getMe);

module.exports = router;
