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
     * Setting the active song and initial settings
     * @param {object} audioData Active song data
     */
    setNewAudio({ commit, }, audioData) {
      new Promise((resolve) => {
        setTimeout(() => {
          commit("setPlay", false);
          commit("setAudioData", audioData);
          commit("setAudio", audioData.audio);

          resolve(true);
        }, 0);
      }).then((play) => {
        commit("setPlay", play);
      }).catch((err) => {
        throw err;
      });
    },

    /**
     * Set active audio if it is not in the store
     * Otherwise change the state of the audio
     * @param {object} audioData An object that stores audio data (id, title, poster, ...)
     */
    setActionForAudio({ getters, commit, dispatch, }, audioData) {
      const currentAudioData = getters["getAudioData"];
      const play = getters["getPlay"];

      if (currentAudioData) {
        if (currentAudioData.id === audioData.id) {
          commit("setPlay", !play);
        } else {
          dispatch("setNewAudio", audioData);
        }
      } else {
        dispatch("setNewAudio", audioData);
      }
    },
    /**
     * Submits a request to add audio
     * @param {string} token User token
     * @param {object} fd Form data containing the required parameters for adding audio
     * @returns {promise} Request result
     */
    async add({ }, { token, fd, }) {
      try {
        const res = await fetch(`${host}/api/audio/add`, {
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
        const res = await fetch(`${host}/api/audio/${audioId}/add/playlist/${playlistId}`, {
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
     * Submits a request to remove an audio
     * @param {string} token User token
     * @param {string|number} audioId Audio id
     * @returns {promise} Request result
     */
    async remove({ }, { token, audioId, }) {
      try {
        const res = await fetch(`${host}/api/audio/${audioId}/remove`, {
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
        const res = await fetch(`${host}/api/audio/${audioId}/favorite`, {
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
        const res = await fetch(`${host}/api/audio`, {
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
     * Converts a path to a valid file path
     * @param {string} path path url
     * @returns {string} valid url file
     */
    async getValidAudioAndPosterUrl({ }, path) {
      if (/^\/\_nuxt\//.test(path)) {
        return path;
      }

      const url = await require(`@/audio/${path}`);

      return url.default ? url.default : url;
    },
  },
};