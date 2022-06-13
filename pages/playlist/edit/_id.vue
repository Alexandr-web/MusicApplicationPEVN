<template>
  <div class="page playlist">
    <div class="container">
      <div class="playlist__inner">
        <vFormEditPlaylist
          v-if="Object.keys(playlist).length"
          :playlist="playlist"
          :pending="pendingEdit"
          :audio="userAudio"
          @setStateAudioAtPlaylist="setStateAudioAtPlaylist"
          @setAudio="setAudio"
          @edit="edit"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import getValidAudioAndPosterUrlMixin from "@/mixins/getValidAudioAndPosterUrlMixin";
  import setNewAudioMixin from "@/mixins/setNewAudioMixin";
  import vFormEditPlaylist from "@/components/playlist/vFormEditPlaylist";

  export default {
    name: "EditPlaylistPage",
    components: { vFormEditPlaylist, },
    mixins: [getValidAudioAndPosterUrlMixin, setNewAudioMixin],
    layout: "default",
    validate({ params: { id: playlistId, }, store, }) {
      const token = store.getters["auth/getToken"];
      const res = store.dispatch("playlist/getOne", { token, playlistId, });

      return res.then(({ ok, playlist, }) => ok && Boolean(playlist)).catch((err) => {
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
    async fetch() {
      try {
        const { id: playlistId, } = this.$route.params;
        const { user: { id: userId, }, } = await this.$store.dispatch("auth/getUser");
        const token = this.$store.getters["auth/getToken"];
        const { ok, audio, playlist, } = await this.$store.dispatch("profile/getDataForEditPlaylist", { token, userId, playlistId, });

        if (ok) {
          this.$store.commit("audio/setPlaylist", audio);
          this.playlist = playlist;

          audio.map((song) => this.userAudio.push({ ...song, }));
        }
      } catch (err) {
        throw err;
      }
    },
    computed: {
      getAudioData() {
        return this.$store.getters["audio/getAudioData"];
      },
      getPlay() {
        return this.$store.getters["audio/getPlay"];
      },
    },
    methods: {
      setAudio(audio) {
        if (this.getAudioData && this.getAudioData.id === audio.id) {
          this.$store.commit("audio/setPlay", !this.getPlay);
        } else {
          this.setActiveAudio(audio);
        }
      },
      setStateAudioAtPlaylist(audio) {
        this.userAudio = this.userAudio.map((song) => {
          if (audio.id === song.id) {
            song.have = !audio.have;
          }

          return song;
        });
      },
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