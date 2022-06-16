<template>
  <div class="profile__tab-block profile__tab-artists">
    <ul
      v-if="artists.length"
      class="artists__list"
    >
      <li
        v-for="(artist, index) in artists"
        :key="index"
        class="artists__list-item"
      >
        <nuxt-link
          class="artists__list-link"
          :to="`/?search=${artist.name}`"
        >
          {{ artist.name }}
        </nuxt-link>
      </li>
    </ul>
    <vNothing v-else />
  </div>
</template>

<script>
  import vNothing from "@/components/general/vNothing";

  export default {
    name: "ProfileArtistsComponent",
    components: { vNothing, },
    data() {
      return { artists: [], };
    },
    // async fetch() {
    //   try {
    //     const { id, } = this.$route.params;

    //     if (id) {
    //       const token = this.$store.getters["auth/getToken"];
    //       const { ok, songs, } = await this.$store.dispatch("profile/getAudio", { userId: parseInt(id), token, });
        
    //       if (ok) {
    //         this.artists = ;
    //       }
    //     }
    //   } catch (err) {
    //     throw err;
    //   }
    // },
  };
</script>