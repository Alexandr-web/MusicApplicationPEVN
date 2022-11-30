import jsCookie from "js-cookie";
import jwtDecode from "jwt-decode";

const host = require("../server/host");
const Cookie = require("cookie");

export default {
  state() {
    return { token: null, };
  },
  getters: { getToken: (state) => state.token, },
  mutations: {
    setToken(state, val) {
      state.token = val;

      jsCookie.set("token", val);
    },

    clearToken(state) {
      state.token = null;

      jsCookie.remove("token");
    },
  },
  actions: {
    /**
     * Sends a user registration request
     * @param {object} fd Form data containing the necessary parameters for user registration in the system
     * @returns {promise} Request result
     */
    async registration({ }, fd) {
      try {
        const res = await fetch(`${host}/api/auth/registration`, {
          method: "POST",
          headers: { "Accept-Type": "application/json", },
          body: fd,
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    /**
     * Sends a request for a user login
     * @param {object} fd Form data containing the necessary parameters for user login in the system
     * @returns {promise} Request result
     */
    async login({ commit, }, fd) {
      try {
        const res = await fetch(`${host}/api/auth/login`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fd),
        });

        const data = await res.json();

        if (data.ok) {
          commit("setToken", data.token.replace(/^Bearer /, ""));
        }

        return data;
      } catch (err) {
        throw err;
      }
    },

    // Checks for the presence of a token in the cookie, and then sets its value to the store if its time has not passed
    async autoLogin({ commit, }) {
      try {
        const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie || "";
        const findToken = Cookie.parse(cookieStr);

        if (findToken) {
          const isValidToken = (tkn) => {
            if (!tkn) {
              return false;
            }

            const tokenData = jwtDecode(tkn) || {};
            const expires = tokenData.exp || 0;

            return (new Date().getTime() / 1000) < expires;
          };

          return isValidToken(findToken.token) ? commit("setToken", findToken.token) : commit("clearToken");
        }

        return commit("clearToken");
      } catch (err) {
        throw err;
      }
    },
  },
};