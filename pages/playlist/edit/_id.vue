<template>
  <div class="gaps-t-b playlist">
    <div class="container">
      <div class="playlist__inner">
        <vFormEditPlaylist
          v-if="Object.keys(playlist).length && audio.length"
          :playlist="playlist"
          :pending="pendingEdit"
          :audio="audio"
          @setStateAudioAtPlaylist="setStateAudioAtPlaylist"
          @edit="edit"
        />
        <vNothing
          v-if="!audio.length"
          text="Нет аудио для создания плейлиста"
          :gaps="true"
          :link="{
            to: '/',
            text: 'Найти аудио',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vFormEditPlaylist from "@/components/vFormEditPlaylist";
  import vNothing from "@/components/vNothing";

  export default {
    name: "EditPlaylistPage",
    components: {
      vFormEditPlaylist,
      vNothing,
    },
    layout: "default",
    // Checking if the playlist exists
    validate({ params: { id: playlistId, }, store, }) {
      const token = store.getters["auth/getToken"];
      const res = store.dispatch("playlist/getOne", { token, playlistId, });

      return res
        .then(({ ok, playlist, }) => ok && Boolean(playlist))
        .catch((err) => {
          throw err;
        });
    },
    // Getting data to change the playlist
    async asyncData({ store, params: { id: playlistId, }, }) {
      try {
        const token = store.getters["auth/getToken"];
        const { ok, audio, playlist, } = await store.dispatch("profile/getDataForEditPlaylist", { token, playlistId, });

        if (!ok) {
          return {
            playlist: {},
            audio: [],
          };
        }

        const audioPromises = audio.map((song) => {
          const pPoster = store.dispatch("audio/getValidAudioAndPosterUrl", song.poster);
          const pAudio = store.dispatch("audio/getValidAudioAndPosterUrl", song.audio);

          return Promise.all([pPoster, pAudio])
            .then(([posterUrl, audioUrl]) => ({ ...song, poster: posterUrl, audio: audioUrl, }))
            .catch((err) => {
              throw err;
            });
        });

        return Promise.all(audioPromises)
          .then((songs) => {
            store.commit("playlist/setPlaylist", songs);
            
            return {
              playlist,
              audio: songs.map((song) => {
                song.have = playlist.audio.includes(song.id);

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
      return { pendingEdit: false, };
    },
    head: { title: "Изменение плейлиста", },
    computed: {
      getToken() {
        return this.$store.getters["auth/getToken"];
      },
    },
    methods: {
      /**
       * Deleting/Adding a Song to a Playlist
       * @param {object} audio the audio we want to add/remove
       */
      setStateAudioAtPlaylist(audio) {
        const indexAudio = this.audio.findIndex(({ id, }) => id === audio.id);
        
        this.$set(this.audio, indexAudio, { ...audio, have: !audio.have, });
      },
      /**
       * Handles an emit to change a playlist
       * @param {object} data data to be changed in the playlist
       */
      edit(data) {
        const fd = new FormData();
        const token = this.getToken;
        const { id: playlistId, } = this.playlist;

        Object.keys(data).map((key) => fd.append(key, data[key]));

        const res = this.$store.dispatch("playlist/edit", { token, playlistId, fd, });

        this.pendingEdit = true;

        res.then(({ ok, message, }) => {
          this.pendingEdit = false;
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