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

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
