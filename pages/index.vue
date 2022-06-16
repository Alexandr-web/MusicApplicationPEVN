<template>
  <div class="gaps-t-b home">
    <div class="container">
      <div class="home__inner">
        <div class="home__column">
          <h1 class="title home__column-title">
            Плейлисты
          </h1>
          <ul
            v-if="playlists.length"
            class="home__playlists"
          >
            <vPlaylist
              v-for="(playlist, index) in playlists"
              :key="index"
              :playlist="playlist"
              @setPlaylist="setPlaylist"
            />
          </ul>
          <vNothing v-else />
        </div>
        <vPlaylistModal 
          v-if="Object.keys(objectPlaylist).length"
          :playlist="objectPlaylist"
          :show="showPlaylistModal"
          @hide="showPlaylistModal = false"
          @removePlaylist="removePlaylist"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vPlaylist from "@/components/general/vPlaylist";
  import vPlaylistModal from "@/components/playlist/vPlaylistModal";
  import vNothing from "@/components/general/vNothing";
  import getValidPlaylistPosterMixin from "@/mixins/getValidPlaylistPosterMixin";

  export default { 
    name: "MainPage",
    components: {
      vPlaylist,
      vPlaylistModal,
      vNothing,
    },
    mixins: [getValidPlaylistPosterMixin],
    layout: "default",
    data() {
      return {
        playlists: [],
        objectPlaylist: {},
        showPlaylistModal: false,
      };
    },
    async fetch() {
      try {
        const token = this.$store.getters["auth/getToken"];
        const { ok, playlists, } = await this.$store.dispatch("playlist/getAll", { token, });

        if (ok) {
          playlists.map((playlist) => {
            this.getValidPlaylistPoster(playlist.poster).then((url) => {
              this.playlists.push({ ...playlist, poster: url, });
            }).catch((err) => {
              throw err;
            });
          });
        }
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Главная", },
    watch: {
      showPlaylistModal(val) {
        document.documentElement.style.overflow = val ? "hidden" : "visible";
      },
    },
    methods: {
      setPlaylist(playlist) {
        const playlistAudioFetch = this.$store.dispatch("playlist/getAudio", { playlistId: playlist.id, });

        this.$store.commit("audio/setPlaylist", []);
        this.objectPlaylist = {};

        playlistAudioFetch.then(({ ok, audio, }) => {
          if (ok) {
            this.$store.commit("audio/setPlaylist", audio);
            this.objectPlaylist = playlist;
            this.showPlaylistModal = true;
          }
        }).catch((err) => {
          throw err;
        });
      },
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
</script>