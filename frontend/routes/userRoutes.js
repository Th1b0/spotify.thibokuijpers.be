const router = require("express").Router();
const path = require("path");
const { authenticate } = require("../../api/middleware/authenticate");
const html = path.join(__dirname, "..", "public", "html");
router.get("/profile", authenticate, (req, res) => {
  res.sendFile(path.join(html, "profile.html"));
});
router.get("/playlists", authenticate, (req, res) => {
  res.sendFile(path.join(html, "playlist.html"));
});

router.get("/play", (req, res) => {
  res.sendFile(path.join(html, "play.html"));
});
module.exports = router;
