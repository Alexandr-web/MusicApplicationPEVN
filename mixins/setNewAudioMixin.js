import getValidAudioAndPosterUrlMixin from "@/mixins/getValidAudioAndPosterUrlMixin";

export default {
  mixins: [getValidAudioAndPosterUrlMixin],
  methods: {
    async setActiveAudio(audioData) {
      try {
        const poster = await this.getValidAudioAndPosterUrl(audioData.poster);
        const audio = await this.getValidAudioAndPosterUrl(audioData.audio);

        this.$store.commit("audio/setAudioData", { ...audioData, poster, });
        this.$store.commit("audio/setAudio", audio);
        this.$store.commit("audio/setPlay", true);
      } catch (err) {
        throw err;
      }
    },
  },
};