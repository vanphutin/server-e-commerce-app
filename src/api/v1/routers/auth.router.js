const express = require("express");
const router = express.Router();
const authController = require("../../v1/controllers/auth.controller");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validate.middleware");

router.post("/register", validateRegister, authController.authRegister);
router.post("/login", validateLogin, authController.authLogin);
router.post("/verifyToken", authController.authVeryToken);

module.exports = router;
