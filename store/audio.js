const host = require("../server/host");

export default {
  state() {
    return {
      audioData: null,
      play: false,
      currentTime: 0,
      volume: 1,
      audio: null,
    };
  },
  mutations: {
    setAudioData(state, val) {
      state.audioData = val;
    },
    setAudio(state, val) {
      state.audio = val;
    },
    setPlay(state, val) {
      state.play = val;
    },
    setCurrentTime(state, val) {
      state.currentTime = val;
    },
    setVolume(state, val) {
      state.volume = val;
      localStorage.setItem("volume", val);
    },
    clearAudio(state) {
      state.play = false;
      state.audio = null;
      state.audioData = null;
    },
  },
  getters: {
    getAudioData: (state) => state.audioData,
    getAudio: (state) => state.audio,
    getPlay: (state) => state.play,
    getCurrentTime: (state) => state.currentTime,
    getVolume: (state) => state.volume,
  },
  actions: {
    /**
     * Submits a request to add audio
     * @param {string} token User token
     * @param {object} fd Form data containing the required parameters for adding audio
     * @returns {promise} Request result
     */
    async add({ }, { token, fd, }) {
      try {
        const res = await fetch(`${host}/audio/add`, {
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
     * Sends a request to add audio to a playlist
     * @param {string} token User token
     * @param {string|number} audioId Audio id
     * @param {string|number} playlistId Playlist id
     * @returns {promise} Request result
     */
    async addToPlaylist({ }, { token, audioId, playlistId, }) {
      try {
        const res = await fetch(`${host}/audio/add/playlist/${playlistId}`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify({ audioId, }),
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Submits a request to remove an audio
     * @param {string} token User token
     * @param {string|number} audioId Audio id
     * @returns {promise} Request result
     */
    async remove({ }, { token, audioId, }) {
      try {
        const res = await fetch(`${host}/audio/${audioId}/remove`, {
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
     * Sends a request to add audio to favorites
     * @param {string} token User token
     * @param {string|number} audioId Audio id
     * @returns {promise} Request result
     */
    async setFavorite({ }, { token, audioId, }) {
      try {
        const res = await fetch(`${host}/audio/${audioId}/favorite`, {
          method: "POST",
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
     * Gets all audio
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async getAll({ }, { token, }) {
      try {
        const res = await fetch(`${host}/audio/api`, {
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
  },
};