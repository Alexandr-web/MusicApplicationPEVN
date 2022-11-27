<template>
  <div class="profile__tab-block profile__tab-favorite">
    <ul
      v-if="songs.length"
      class="audio__list"
    >
      <vAudio
        v-for="(audio, index) in songs"
        :key="index"
        :audio="audio"
        :no-controls="true"
        @setActiveAudio="setAudio"
      />
    </ul>
    <vNothing v-else />
  </div>
</template>

<script>
  import vNothing from "@/components/vNothing";
  import vAudio from "@/components/vAudio";

  export default {
    name: "ProfileFavoriteAudioComponent",
    components: {
      vNothing,
      vAudio,
    },
    data() {
      return { songs: [], };
    },
    // Getting favorite songs
    async fetch() {
      try {
        const token = this.getToken;
        const { id, } = this.getUser;
        const { ok, audio, } = await this.$store.dispatch("profile/getFavorites", { token, id, });

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
              this.songs = songs;
              this.$store.commit("playlist/setPlaylist", songs);
            }).catch((err) => {
              throw err;
            });
        }
      } catch (err) {
        throw err;
      }
    },
    computed: {
      getPlaylist() {
        return this.$store.getters["playlist/getPlaylist"];
      },
      getUser() {
        return this.$store.getters["profile/getUser"];
      },
      getToken() {
        return this.$store.getters["auth/getToken"];
      },
    },
    methods: {
      setAudio(audioData) {
        this.$store.dispatch("audio/setActionForAudio", audioData);
      },
    },
  };
</script>