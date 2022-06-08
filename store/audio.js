import host from "../server/host";

export default {
  state() {
    return {
      audioData: null,
      play: false,
      currentTime: 0,
      volume: 1,
      audio: null,
      playlist: null,
    };
  },
  mutations: {
    setAudioData(state, val) {
      state.audioData = val;
    },
    setPlaylist(state, val) {
      state.playlist = val;
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
    },
  },
  getters: {
    getAudioData: (state) => state.audioData,
    getAudio: (state) => state.audio,
    getPlay: (state) => state.play,
    getCurrentTime: (state) => state.currentTime,
    getVolume: (state) => state.volume,
    getPlaylist: (state) => state.playlist,
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
    async addToPlaylist({ }, { token, audioId, playlistId, }) {
      try {
        const res = await fetch(`${host}/audio/add/playlist/${playlistId}`, {
          method: "POST",
          headers: {
            "Accept-Type": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ audioId, }),
        });

        return res.json();
      } catch (err) {
        throw err;
      }
    },
  },
};