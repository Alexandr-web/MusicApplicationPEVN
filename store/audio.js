import host from "../server/host";

export default {
  state() {
    return { audio: null, };
  },
  mutations: {
    setAudio(state, val) {
      state.audio = val;
    },
    play(state) {
      if (state.audio) {
        state.audio.play();
      }
    },
    pause(state) {
      if (state.audio) {
        state.audio.pause();
      }
    },
  },
  getters: { getAudio: (state) => state.audio, },
  actions: {
    async add({ }, { token, fd, }) {
      try {
        const res = await fetch(`${host}/audio/add`, {
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
  },
};