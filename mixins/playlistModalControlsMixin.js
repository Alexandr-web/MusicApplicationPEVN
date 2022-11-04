export default {
  data() {
    return {
      objectPlaylist: {},
      showPlaylistModal: false,
    };
  },
  methods: {
    /**
     * Sets a new playlist
     * @param {object} playlist The playlist we want to set
     */
    setPlaylist(playlist) {
      const playlistAudioFetch = this.$store.dispatch("playlist/getAudio", { playlistId: playlist.id, });

      this.$store.commit("playlist/setPlaylist", []);
      this.objectPlaylist = {};

      playlistAudioFetch.then(({ ok, audio, }) => {
        if (ok) {
          this.$store.commit("playlist/setPlaylist", audio);
          this.objectPlaylist = playlist;
          this.showPlaylistModal = true;
        }
      }).catch((err) => {
        throw err;
      });
    },

    /**
     * Removes playlists from the database
     * @param {object} playlist The playlist we want to delete
     */
    async removePlaylist({ id: playlistId, }) {
      try {
        const token = this.$store.getters["auth/getToken"];
        const { ok, message, } = await this.$store.dispatch("playlist/remove", { token, playlistId, });

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