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
    async registration({ }, fd) {
      try {
        const res = await fetch(`${host}/auth/registration`, {
          method: "POST",
          headers: { "Accept-Type": "application/json", },
          body: fd,
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    async login({ commit, }, fd) {
      try {
        const res = await fetch(`${host}/auth/login`, {
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