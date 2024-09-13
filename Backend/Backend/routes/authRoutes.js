const express = require("express");
const {
  register,
  login,
  forgotPassword,
  userMe,
  forgotPasswordRequest,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password-request", forgotPasswordRequest);
router.get("/user", userMe);

module.exports = router;
