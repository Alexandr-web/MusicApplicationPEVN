import host from "../server/host";

export default {
  state() {
    return {
      audioData: null,
      play: false,
      currentTime: 0,
      volume: 1,
    };
  },
  mutations: {
    setAudioData(state, val) {
      state.audioData = val;
    },
    setPlay(state, val) {
      state.play = val;
    },
    setCurrentTime(state, val) {
      state.currentTime = val;
    },
    setVolume(state, val) {
      state.volume = val;
    },
    setAudioProp(state, { key, val, }) {
      if (state.audioData) {
        state.audioData.audio[key] = val;
      }
    },
    stopAudio(state) {
      if (state.audioData) {
        state.audioData.audio.currentTime = 0;
        state.audioData.audio.pause();
      }
    },
  },
  getters: {
    getAudioData: (state) => state.audioData,
    getPlay: (state) => state.play,
    getCurrentTime: (state) => state.currentTime,
    getVolume: (state) => state.volume,
  },
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