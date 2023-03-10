let curr_track = document.createElement("audio");

let trackList = null;
async function getTracks() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const playlistId = urlParams.get("id");
  const TRACKS_API_URL = ` /api/playlist/${playlistId}/tracks`;
  const response = await fetch(TRACKS_API_URL);
  const tracks = await response.json();
  trackList = tracks;
}
getTracks();
let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
const playBtn = document.querySelector(".playBtn");
const skipBtn = document.querySelector("skipBtn");
const rewindBtn = document.querySelector("rewindBtn");

let isPlaying = false;
let updateTimer;

function startPlayer() {
  curr_track.play();
  isPlaying = true;

  playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
}
function stopPlayer() {
  curr_track.pause();
  isPlaying = false;
  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
}

function playpausePlayer() {
  if (!isPlaying) startPlayer();
  else stopPlayer();
}

function loadPlayer(name, artist, cover) {
  clearInterval(updateTimer);
  resetValues();

  const searchQuery = `${name} ${artist} lyrics`;
  curr_track.src = `/music/${searchQuery.replace(/[\\/]/g, "")} audio`;
  const player_artist = document.querySelector(".player_artist");
  const player_cover = document.querySelector(".player_cover");
  const player_song = document.querySelector(".player_song");

  player_artist.innerText = artist;
  player_cover.src = cover;
  player_song.innerText = name;

  curr_track.load();
  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("canplaythrough", startPlayer);
}
function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}
function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}
function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(
      curr_track.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

async function nextTrack() {
  const track = trackList[[Math.floor(Math.random() * trackList.length)]];
  loadPlayer(track.name, track.artist, track.cover);
}
async function prevTrack() {
  const track = trackList[[Math.floor(Math.random() * trackList.length)]];
  loadPlayer(track.name, track.artist, track.cover);
}
