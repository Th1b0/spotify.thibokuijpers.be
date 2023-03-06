const router = require("express").Router();
const path = require("path");
const { authenticate } = require("../../api/middleware/authenticate");
const html = path.join(__dirname, "..", "public", "html");
router.get("/login", (req, res) => {
  res.sendFile(path.join(html, "login.html"));
});
router.get("/unauthorized", (req, res) => {
  res.sendFile(path.join(html, "unauthorized.html"));
});
module.exports = router;
