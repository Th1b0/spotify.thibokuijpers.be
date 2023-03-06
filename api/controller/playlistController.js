const { httpError } = require("../helper/httpError");
const axios = require("axios");
const qs = require("qs");

class PlaylistController {
  static async get(req, res) {
    try {
      const access_token = req.access_token;
      const response = await axios({
        method: "get",
        url: "https://api.spotify.com/v1/me/playlists",
        params: {
          limit: 50,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = response.data.items;
      const playlist = data.map((playlist) => {
        return {
          playlist: {
            name: playlist.name,
            description: playlist.description,
            owner: playlist.owner,
            cover: playlist.images[0].url,
            url: playlist.external_urls.spotify,
            tracks: playlist.tracks,
            id: playlist.id,
          },
        };
      });

      return res.json(playlist);
    } catch (error) {
      console.log(error);
      httpError(res, 401, null);
    }
  }
  static async getTracks(req, res) {
    const MAX_TRACK_LIMIT = 50;
    const MAX_PLAYLIST_LIMIT = 100;
    const playlistId = req.params.playlist_id;
    const access_token = req.access_token;

    try {
      let trackResponses = [];
      let offset = 0;
      let totalTracks = 1;

      // Loop through all tracks in the playlist
      while (offset < totalTracks) {
        const tracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        // Request tracks from Spotify API with max playlist limit
        const tracksResponse = await axios.get(tracksUrl, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: {
            limit: MAX_PLAYLIST_LIMIT,
            offset: offset,
          },
        });

        const tracksData = tracksResponse.data;
        const tracks = tracksData.items;

        // Get the total number of tracks in the playlist if it's not available yet
        if (totalTracks === 1) {
          totalTracks = tracksData.total;
        }

        // Create an array of track IDs for the current batch of tracks
        const trackIds = tracks.map((track) => track.track?.id).filter(Boolean);

        // Loop through all the track IDs in batches of MAX_TRACK_LIMIT
        for (let i = 0; i < trackIds.length; i += MAX_TRACK_LIMIT) {
          const trackIdsSubset = trackIds.slice(i, i + MAX_TRACK_LIMIT);

          // Request track details from Spotify API with max track limit
          const tracksDetailsUrl = "https://api.spotify.com/v1/tracks";
          const trackDetailsResponse = await axios.get(tracksDetailsUrl, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            params: {
              ids: trackIdsSubset.join(","),
            },
          });

          const trackDetailsData = trackDetailsResponse.data;
          const trackDetails = trackDetailsData.tracks;

          // Flatten the track details and add cover image
          const flattenedTracks = trackDetails.map((track) => ({
            name: track.name,
            duration: track.duration_ms,
            artist: track.artists.map((artist) => artist.name).join(", "),
            cover: track.album.images[0]?.url,
          }));

          // Add the flattened tracks to the response array
          trackResponses.push(...flattenedTracks);
        }

        // Increment the offset by the playlist limit for the next batch of tracks
        offset += MAX_PLAYLIST_LIMIT;
      }

      res.status(200).json(trackResponses);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while retrieving the playlist");
    }
  }
}

module.exports = { PlaylistController };
