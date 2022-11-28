<template>
  <div class="gaps-t-b playlist">
    <div class="container">
      <div
        v-if="(audio || []).length"
        class="playlist__inner"
      >
        <vAddPlaylistForm
          :pending="pendingAdd"
          :audio="audio"
          @add="add"
          @setStateAudioAtPlaylist="setStateAudioAtPlaylist"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vAddPlaylistForm from "@/components/vAddPlaylistForm";

  export default {
    name: "AddPlaylistPage",
    components: { vAddPlaylistForm, },
    layout: "default",
    // Gets all of the user's audio, including favorites
    async asyncData({ store, }) {
      try {
        const token = store.getters["auth/getToken"];
        const { id: userId, } = store.getters["profile/getUser"];
        const { ok, songs, } = await store.dispatch("profile/getAudioAndFavorite", { token, userId, });
        
        if (!ok) {
          return { audio: [], };
        }

        const songsPromises = songs.map((song) => {
          const pPoster = store.dispatch("audio/getValidAudioAndPosterUrl", song.poster);
          const pAudio = store.dispatch("audio/getValidAudioAndPosterUrl", song.audio);

          return Promise.all([pPoster, pAudio])
            .then(([poster, audio]) => ({ ...song, poster, audio, }))
            .catch((err) => {
              throw err;
            });
        });

        return Promise.all(songsPromises)
          .then((audio) => {
            store.commit("playlist/setPlaylist", audio);

            return {
              audio: audio.map((song) => {
                song.have = false;

                return song;
              }),
            };
          }).catch((err) => {
            throw err;
          });
      } catch (err) {
        throw err;
      }
    },
    data() {
      return { pendingAdd: false, };
    },
    head: { title: "Добавление плейлиста", },
    computed: {
      getToken() {
        return this.$store.getters["auth/getToken"];
      },
    },
    methods: {
      /**
       * Deleting/Adding a Song to a Playlist
       * @param {object} song the song we want to add/remove
       */
      setStateAudioAtPlaylist(song) {
        const indexAudio = this.audio.findIndex(({ id, }) => id === song.id);
        
        this.$set(this.audio, indexAudio, { ...song, have: !song.have, });
      },
      /**
       * Handles an emit to add a playlist
       * @param {object} data playlist we want to add
       */
      add(data) {
        const fd = new FormData();
        const token = this.getToken;

        Object.keys(data).map((key) => fd.append(key, data[key]));
        
        const res = this.$store.dispatch("playlist/add", { token, fd, });

        this.pendingAdd = true;

        res.then(({ ok, message, }) => {
          this.pendingAdd = false;
          
          alert(message);

          if (ok) {
            this.$router.push("/");
          }
        }).catch((err) => {
          throw err;
        });
      }, 
    },
  };
</script>