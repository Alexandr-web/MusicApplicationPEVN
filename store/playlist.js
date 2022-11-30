const host = require("../server/host");

export default {
  state() {
    return { playlist: null, };
  },
  mutations: {
    setPlaylist(state, val) {
      state.playlist = val;
    },
    clearPlaylist(state) {
      state.playlist = null;
    },
  },
  getters: { getPlaylist: (state) => state.playlist, },
  actions: {
    /**
     * Gets data to change the playlist
     * @param {string|number} playlistId Playlist id
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async getDataForEditPlaylist({ }, { playlistId, token, }) {
      try {
        const res = await fetch(`${host}/api/playlist/${playlistId}/edit`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets a playlist by id
     * @param {string} token User token
     * @param {string|number} playlistId Playlist id
     * @returns {promise} Request result
     */
    async getOne({ }, { token, playlistId, }) {
      try {
        const res = await fetch(`${host}/api/playlist/${playlistId}`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets all playlists
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async getAll({ }, { token, }) {
      try {
        const res = await fetch(`${host}/api/playlist`, {
          method: "GET",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Sends a request to add a playlist
     * @param {string} token User token
     * @param {object} fd Form data containing the necessary parameters for adding a playlist
     * @returns {promise} Request result
     */
    async add({ }, { token, fd, }) {
      try {
        const res = await fetch(`${host}/api/playlist/add`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: fd,
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets the audio playlist
     * @param {string|number} playlistId Playlist id
     * @returns {promise} Request result
     */
    async getAudio({ }, { playlistId, }) {
      try {
        const res = await fetch(`${host}/api/playlist/${playlistId}/audio`, {
          method: "GET",
          headers: { "Accept-Type": "application/json", },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Sends a request to delete a playlist
     * @param {string|number} playlistId Playlist id
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async remove({ }, { playlistId, token, }) {
      try {
        const res = await fetch(`${host}/api/playlist/${playlistId}/remove`, {
          method: "DELETE",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Sends a request to edit a playlist
     * @param {string} token User string
     * @param {*} playlistId Playlist id
     * @param {*} fd Form data containing the necessary parameters for editing the playlist
     * @returns {promise} Request result
     */
    async edit({ }, { token, playlistId, fd, }) {
      try {
        const res = await fetch(`${host}/api/playlist/${playlistId}/edit`, {
          method: "PUT",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: fd,
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Converts a path to a valid file path
     * @param {string} path path url
     * @returns {string} valid url file
     */
    async getValidPlaylistPoster({ }, path) {
      if (/^\/\_nuxt\//.test(path)) {
        return path;
      }

      return require(`@/playlistPosters/${path}`);
    },
  },
};