import host from "../server/host";

export default {
  actions: {
    async edit({ }, { fd, userId, token, }) {
      try {
        const res = await fetch(`${host}/profile/edit/${userId}`, {
          method: "PUT",
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
  },
};