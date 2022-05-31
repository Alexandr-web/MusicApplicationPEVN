<template>
  <div class="profile__tab-block profile__tab-artists">
    <ul
      v-if="artists.length"
      class="artists__list"
    >
      <li class="artists__list-item">
        <nuxt-link
          class="artists__list-link"
          :to="`/?search=${artist.name}`"
        >
          {{ artist.name }}
        </nuxt-link>
      </li>
    </ul>
    <div
      v-else
      class="nothing"
    >
      <span class="nothing__text">Ничего нет</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ProfileArtistsComponent",
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data() {
      return { artists: [], };
    },
    async fetch() {
      try {
        const { id, } = this.user;
        const token = this.$store.getters["auth/getToken"];
        const { ok, songs, } = await this.$store.dispatch("profile/getAudio", { userId: id, token, });
      
        if (ok) {
          this.artists = songs.map(({ author, }) => author);
        }
      } catch (err) {
        throw err;
      }
    },
  };
</script>