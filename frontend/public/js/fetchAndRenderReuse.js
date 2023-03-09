async function renderSidebar(playlists) {
  const sidebar_items = document.getElementById("sidebar_items");
  playlists.forEach((i, v) => {
    const playlistlink = document.createElement("a");
    playlistlink.innerText = i.playlist.name;
    playlistlink.onclick = function () {
      location.href = `/user/playlists?id=${i.playlist.id}&name=${i.playlist.name}&owner=${i.playlist.owner.display_name}`;
    };
    sidebar_items.appendChild(playlistlink);
  });
}
async function getPlaylists() {
  const profile_URL = "/api/playlist";
  const response = await fetch(profile_URL);
  const playlists = await response.json();
  return playlists;
}
async function getProfile() {
  const profile_URL = "/api/auth";
  const response = await fetch(profile_URL);
  const profile = await response.json();
  renderProfile(profile);
}
