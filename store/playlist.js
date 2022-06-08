import host from "../server/host";

export default {
  actions: {
    async add({ }, { token, fd, }) {
      try {
        const res = await fetch(`${host}/playlist/add`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
  },
};