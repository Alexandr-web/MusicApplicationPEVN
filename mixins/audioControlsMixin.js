import getValidAudioAndPosterUrlMixin from "@/mixins/getValidAudioAndPosterUrlMixin";

export default {
  mixins: [getValidAudioAndPosterUrlMixin],
  methods: {
    async setAudio(audioData) {
      if (this.getAudioData && this.getAudioData.id === audioData.id) {
        this.$store.commit("audio/setPlay", !this.getPlay);
      } else {
        const audio = await this.getValidAudioAndPosterUrl(audioData.audio);
        const poster = await this.getValidAudioAndPosterUrl(audioData.poster);

        this.$store.commit("audio/stopAudio");
        this.$store.commit("audio/setAudioData", { ...audioData, poster, audio: new Audio(audio), });
        this.$store.commit("audio/setPlay", true);

        this.getAudioData.audio.addEventListener("timeupdate", this.timeupdate);
      }
    },
    timeupdate() {
      const audio = this.getAudioData.audio;

      this.$store.commit("audio/setCurrentTime", audio.currentTime);
    },
    setStateAudio(val) {
      this.getAudioData.audio[val ? "play" : "pause"]();
      this.$store.commit("audio/setAudioProp", { key: "volume", val: this.getVolume, });
    },
  },
  watch: {
    getPlay(val) {
      this.setStateAudio(val);
    },
    getAudioData() {
      this.setStateAudio(this.getPlay);
    },
    getVolume(val) {
      this.$store.commit("audio/setAudioProp", { key: "volume", val, });
    },
  },
  computed: {
    getAudioData() {
      return this.$store.getters["audio/getAudioData"];
    },
    getPlay() {
      return this.$store.getters["audio/getPlay"];
    },
    getVolume() {
      return this.$store.getters["audio/getVolume"];
    },
  },
};