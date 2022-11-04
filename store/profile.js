import jwtDecode from "jwt-decode";

const host = require("../server/host");
const Cookie = require("cookie");

export default {
  state: () => ({ user: null, }),
  getters: { getUser: (state) => state.user, },
  mutations: {
    setUser(state, val) {
      state.user = val;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  actions: {
    /**
     * Sends a request to change user data
     * @param {object} fd Form data containing the necessary parameters to edit the user
     * @param {string|number} userId User id
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async edit({ }, { fd, userId, token, }) {
      try {
        const res = await fetch(`${host}/profile/edit/${userId}`, {
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
     * Gets the user's audio
     * @param {string|number} userId User id
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async getAudio({ }, { userId, token, }) {
      try {
        const res = await fetch(`${host}/profile/api/${userId}/audio`, {
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
     * Gets the user's playlists
     * @param {string|number} userId User id
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async getPlaylists({ }, { userId, token, }) {
      try {
        const res = await fetch(`${host}/profile/api/${userId}/playlists`, {
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
     * Gets data to change the playlist
     * @param {string|number} playlistId Playlist id
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async getDataForEditPlaylist({ }, { playlistId, token, }) {
      try {
        const res = await fetch(`${host}/profile/api/edit/playlist/${playlistId}`, {
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
     * Gets all of the user's audio, including favorites
     * @param {string|number} userId User id
     * @param {string} token User token
     * @returns {promise} Request result
     */
    async getAudioAndFavorite({ }, { userId, token, }) {
      try {
        const res = await fetch(`${host}/profile/api/${userId}/audio?favorite=true`, {
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
     * Gets a user by id
     * @param {string|number} id User id
     * @returns {promise} Request result
     */
    async getOne({ }, id) {
      try {
        const sendReq = async (userId) => {
          const res = await fetch(`${host}/profile/api/${userId}`, {
            method: "GET",
            headers: { "Accept-Type": "application/json", },
          });

          return res.json();
        };

        if (id) {
          return sendReq(id);
        }

        const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie || "";
        const findToken = Cookie.parse(cookieStr || "");
        const res = jwtDecode(findToken.token);

        if (Object.keys(res).length) {
          return sendReq(res.dataValues.id);
        }

        return {};
      } catch (err) {
        throw err;
      }
    },

    /**
     * Gets the favorites audio
     * @param {string} token User token
     * @param {string|number} id User id
     * @returns {promise} Request result
     */
    async getFavorites({ }, { token, id, }) {
      try {
        const res = await fetch(`${host}/profile/api/${id}/favorites`, {
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
