import host from "../server/host";

export default {
  actions: {
    async getOne({ }, { token, playlistId, }) {
      try {
        const res = await fetch(`${host}/playlist/api/${playlistId}`, {
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

    async getAll({ }, { token, }) {
      try {
        const res = await fetch(`${host}/playlist/api`, {
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

    async add({ }, { token, fd, }) {
      try {
        const res = await fetch(`${host}/playlist/add`, {
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

    async getAudio({ }, { playlistId, }) {
      try {
        const res = await fetch(`${host}/playlist/api/${playlistId}/audio`, {
          method: "GET",
          headers: { "Accept-Type": "application/json", },
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },

    async remove({ }, { playlistId, token, }) {
      try {
        const res = await fetch(`${host}/playlist/${playlistId}/remove`, {
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

    async edit({ }, { token, playlistId, fd, }) {
      try {
        const res = await fetch(`${host}/playlist/edit/${playlistId}`, {
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
  },
};