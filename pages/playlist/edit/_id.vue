<template>
  <div class="gaps-t-b playlist">
    <div class="container">
      <div class="playlist__inner">
        <vFormEditPlaylist
          v-if="Object.keys(playlist).length && userAudio.length"
          :playlist="playlist"
          :pending="pendingEdit"
          :audio="userAudio"
          @setStateAudioAtPlaylist="setStateAudioAtPlaylist"
          @setAudio="setAudio"
          @edit="edit"
        />
        <vNothing
          v-if="!userAudio.length"
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
  import getValidAudioAndPosterUrlMixin from "@/mixins/getValidAudioAndPosterUrlMixin";
  import setNewAudioMixin from "@/mixins/setNewAudioMixin";
  import vFormEditPlaylist from "@/components/vFormEditPlaylist";
  import vNothing from "@/components/vNothing";

  export default {
    name: "EditPlaylistPage",
    components: {
      vFormEditPlaylist,
      vNothing,
    },
    mixins: [getValidAudioAndPosterUrlMixin, setNewAudioMixin],
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
    data() {
      return {
        playlist: {},
        pendingEdit: false,
        userAudio: [],
      };
    },
    // Getting data to change the playlist
    async fetch() {
      try {
        const { id: playlistId, } = this.$route.params;
        const token = this.$store.getters["auth/getToken"];
        const { ok, audio, playlist, } = await this.$store.dispatch("profile/getDataForEditPlaylist", { token, playlistId, });

        if (ok) {
          this.$store.commit("playlist/setPlaylist", audio);
          this.playlist = playlist;
          audio.map((song) => this.userAudio.push(song));
        }
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Изменение плейлиста", },
    methods: {
      /**
       * Deleting/Adding a Song to a Playlist
       * @param {object} audio the audio we want to add/remove
       */
      setStateAudioAtPlaylist(audio) {
        this.userAudio = this.userAudio.map((song) => {
          if (audio.id === song.id) {
            song.have = !audio.have;
          }

          return song;
        });
      },
      /**
       * Handles an emit to change a playlist
       * @param {object} data data to be changed in the playlist
       */
      edit(data) {
        const fd = new FormData();
        const token = this.$store.getters["auth/getToken"];
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