<template>
  <div class="profile__tab-block profile__tab-playlists">
    <ul
      v-if="playlists.length"
      class="playlists"
    >
      <vPlaylist
        v-for="(playlist, index) in playlists"
        :key="index"
        :playlist="playlist"
        @setPlaylist="setPlaylist"
      />
      <li class="playlists__item--add">
        <nuxt-link
          class="playlists__item-link"
          to="/playlist/add"
        >
          Добавить
        </nuxt-link>
      </li>
    </ul>
    <vNothing
      v-else
      :link="{
        to: '/playlist/add',
        text: 'Добавить'
      }"
    />
    <vPlaylistModal
      v-if="Object.keys(objectPlaylist).length"
      :playlist="objectPlaylist"
      :show="showPlaylistModal"
      @hide="showPlaylistModal = false"
      @removePlaylist="removePlaylist"
    />
  </div>
</template>

<script>
  import vNothing from "@/components/general/vNothing";
  import vPlaylistModal from "@/components/playlist/vPlaylistModal";
  import vPlaylist from "@/components/general/vPlaylist";
  import getValidPlaylistPosterMixin from "@/mixins/getValidPlaylistPosterMixin";
  import setNewAudioMixin from "@/mixins/setNewAudioMixin";

  export default {
    name: "ProfilePlaylistsComponent",
    components: {
      vNothing,
      vPlaylistModal,
      vPlaylist,
    },
    mixins: [getValidPlaylistPosterMixin, setNewAudioMixin],
    data() {
      return {
        playlists: [],
        objectPlaylist: {},
        showPlaylistModal: false,
      };
    },
    async fetch() {
      try {
        const { id, } = this.$route.params;

        if (id) {
          const token = this.$store.getters["auth/getToken"];
          const { ok, playlists, } = await this.$store.dispatch("profile/getPlaylists", { userId: parseInt(id), token, });

          if (ok) {
            playlists.map((playlist) => {
              this.getValidPlaylistPoster(playlist.poster).then((url) => {
                this.playlists.push({ ...playlist, poster: url, });
              }).catch((err) => {
                throw err;
              });
            });
          }
        }
      } catch (err) {
        throw err;
      }
    },
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
      async removePlaylist(playlist) {
        try {
          const token = this.$store.getters["auth/getToken"];
          const { id: playlistId, } = playlist;
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