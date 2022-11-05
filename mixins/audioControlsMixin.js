import getValidAudioAndPosterUrlMixin from "@/mixins/getValidAudioAndPosterUrlMixin";

export default {
  mixins: [getValidAudioAndPosterUrlMixin],
  computed: {
    getAudioData() {
      return this.$store.getters["audio/getAudioData"];
    },
    getPlay() {
      return this.$store.getters["audio/getPlay"];
    },
  },
  methods: {
    /**
     * Setting the active song and initial settings
     * @param {object} audioData Active song data
     */
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

    /**
     * Delete song by id
     * @param {number} id id of the song to be deleted
     */
    async removeAudio({ id, }) {
      try {
        const token = this.$store.getters["auth/getToken"];
        const { ok, message, } = await this.$store.dispatch("audio/remove", { audioId: id, token, });

        alert(message);

        if (ok) {
          this.$router.go(0);
        }
      } catch (err) {
        throw err;
      }
    },

    /**
     * Set active audio if it is not in the store
     * Otherwise change the state of the audio
     * @param {object} audioData An object that stores audio data (id, title, poster, ...)
     */
    setAudio(audioData) {
      if (this.getAudioData) {
        if (this.getAudioData.id === audioData.id) {
          this.$store.commit("audio/setPlay", !this.getPlay);
        } else {
          this.$store.commit("audio/clearAudio");
          this.setActiveAudio(audioData);
        }
      } else {
        this.setActiveAudio(audioData);
      }
    },
  },
};