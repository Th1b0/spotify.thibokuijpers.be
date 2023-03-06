const router = require("express").Router();
const { AuthController } = require("../controller/authController");
const { authenticate } = require("../middleware/authenticate");

router.get("/", authenticate, AuthController.auth);
router.get("/login", AuthController.login);
router.get("/callback", AuthController.callback);
router.get("/logout", AuthController.logout);
module.exports = router;
