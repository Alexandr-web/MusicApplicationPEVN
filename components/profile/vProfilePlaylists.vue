<template>
  <div class="profile__tab-block profile__tab-playlists">
    <ul
      v-if="playlists.length"
      class="playlists"
    >
      <li
        v-for="(item, index) in playlists"
        :key="index"
        class="playlists__item"
      >
        <div class="playlists__item-poster">
          <img
            class="playlists__item-poster-image"
            :src="item.poster"
            :alt="item.name"
          >
        </div>
        <h3 class="playlists__item-name">
          {{ item.name }}
        </h3>
      </li>
    </ul>
    <vNothing
      v-else
      :link="{
        to: '/playlist/add',
        text: 'Добавить'
      }"
    />
  </div>
</template>

<script>
  import vNothing from "@/components/general/vNothing";
  import getValidPlaylistPosterMixin from "@/mixins/getValidPlaylistPosterMixin";

  export default {
    name: "ProfilePlaylistsComponent",
    components: { vNothing, },
    mixins: [getValidPlaylistPosterMixin],
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data() {
      return { playlists: [], };
    },
    async fetch() {
      try {
        const { id, } = this.user;
        const token = this.$store.getters["auth/getToken"];
        const { ok, playlists, } = await this.$store.dispatch("profile/getPlaylists", { userId: id, token, });
      
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
  };
</script>