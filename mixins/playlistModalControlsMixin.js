export default {
  data() {
    return {
      objectPlaylist: {},
      showPlaylistModal: false,
    };
  },
  computed: {
    getToken() {
      return this.$store.getters["auth/getToken"];
    },
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

      playlistAudioFetch
        .then(({ ok, audio, }) => {
          if (ok) {
            const audioPromises = audio.map((song) => {
              const pPoster = this.$store.dispatch("audio/getValidAudioAndPosterUrl", song.poster);
              const pAudio = this.$store.dispatch("audio/getValidAudioAndPosterUrl", song.audio);

              return Promise.all([pPoster, pAudio])
                .then(([posterUrl, audioUrl]) => ({ ...song, poster: posterUrl, audio: audioUrl, }))
                .catch((err) => {
                  throw err;
                });
            });

            Promise.all(audioPromises)
              .then((songs) => {
                this.$store.commit("playlist/setPlaylist", songs);
                this.objectPlaylist = playlist;
                this.showPlaylistModal = true;
              }).catch((err) => {
                throw err;
              });
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
        const token = this.getToken;
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