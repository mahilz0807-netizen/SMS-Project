const router = require("express").Router();

const {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

router.post("/register", validateRegister, registerAdmin);
router.post("/login", validateLogin, loginAdmin);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;