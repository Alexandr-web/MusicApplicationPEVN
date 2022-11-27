export default {
  computed: {
    getToken() {
      return this.$store.getters["auth/getToken"];
    },
  },
  methods: {
    /**
     * Delete song by id
     * @param {number} id id of the song to be deleted
     */
    async removeAudio({ id, }) {
      try {
        const token = this.getToken;
        const { ok, message, } = await this.$store.dispatch("audio/remove", { audioId: id, token, });

        alert(message);

        if (ok) {
          this.$router.go(0);
        }
      } catch (err) {
        throw err;
      }
    },
  },
};