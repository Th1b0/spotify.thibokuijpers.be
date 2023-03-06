const router = require("express").Router();
const { PlaylistController } = require("../controller/playlistController");
const { authenticate } = require("../middleware/authenticate");

router.get("/", authenticate, PlaylistController.get);
router.get("/:playlist_id/tracks", authenticate, PlaylistController.getTracks);
module.exports = router;
