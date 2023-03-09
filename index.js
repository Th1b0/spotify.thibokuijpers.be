const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const auth = require("./api/routes/authRoutes");
const playlist = require("./api/routes/playlistRoutes");
const frontendUser = require("./frontend/routes/userRoutes");
const frontendAuth = require("./frontend/routes/authRoutes");

app.use("/html", express.static(__dirname + "/frontend/public/html"));
app.use("/css", express.static(__dirname + "/frontend/public/css"));
app.use("/js", express.static(__dirname + "/frontend/public/js"));
app.use("/img", express.static(__dirname + "/frontend/public/img"));

app.use(cors());
app.use(cookieParser());
app.set("json spaces", 2);
app.use("/api/auth", auth);
app.use("/api/playlist", playlist);
app.use("/user", frontendUser);
app.use("/auth", frontendAuth);
app.get("/", (req, res) => {
  res.redirect("/user/profile");
});

const ytdl = require("ytdl-core");
const rangeParser = require("range-parser");
const ytsr = require("ytsr");

app.get("/music/:songname", async (req, res) => {
  const songname = req.params.songname;
  const searchResults = await ytsr(songname);
  const firstResult = searchResults.items.filter(
    (result) => result.type === "video"
  )[0];
  const audioUrl = `https://www.youtube.com/watch?v=${firstResult.id}`;
  const audioInfo = await ytdl.getInfo(audioUrl);
  const audioFormats = ytdl.filterFormats(audioInfo.formats, "audioonly");
  const audio = ytdl(audioUrl, {
    format: audioFormats[0],
    range: req.headers.range,
  });
  const contentLength = audioFormats[0].contentLength;

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Length", contentLength);
  res.setHeader("Accept-Ranges", "bytes");

  const range = req.headers.range;
  if (range) {
    const ranges = rangeParser(contentLength, range);
    if (ranges === -1 || ranges === -2) {
      res.status(416).send("Requested Range Not Satisfiable");
      return;
    }
    const start = ranges[0].start;
    const end = ranges[0].end;
    res.status(206).header({
      "Content-Range": `bytes ${start}-${end}/${contentLength}`,
    });
    audio.pipe(res.status(206)).status(206);
  } else {
    res.setHeader("Content-Disposition", "inline");
    audio.pipe(res);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
