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
  import vNothing from "@/components/vNothing";
  import vPlaylistModal from "@/components/vPlaylistModal";
  import vPlaylist from "@/components/vPlaylist";
  import playlistModalControlsMixin from "@/mixins/playlistModalControlsMixin";

  export default {
    name: "ProfilePlaylistsComponent",
    components: {
      vNothing,
      vPlaylistModal,
      vPlaylist,
    },
    mixins: [playlistModalControlsMixin],
    data() {
      return { playlists: [], };
    },
    // Get playlists
    async fetch() {
      try {
        const { id, } = this.$route.params;

        if (id) {
          const token = this.getToken;
          const { ok, playlists, } = await this.$store.dispatch("profile/getPlaylists", { userId: parseInt(id), token, });

          if (ok) {
            playlists.map((playlist) => {
              this.$store.dispatch("playlist/getValidPlaylistPoster", playlist.poster)
                .then((url) => {
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
    computed: {
      getToken() {
        return this.$store.getters["auth/getToken"];
      },
    },
    watch: {
      showPlaylistModal(val) {
        document.documentElement.style.overflow = val ? "hidden" : "visible";
      },
    },
  };
</script>