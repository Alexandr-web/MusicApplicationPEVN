<template>
  <div class="profile__tab-block profile__tab-audio">
    <ul class="audio__list">
      <li
        v-for="num in 4"
        :key="num"
        class="audio__list-item"
      >
        <div class="audio__list-block audio__list-info">
          <img
            class="audio__list-poster"
            src="http://localhost:3000/_nuxt/avatars/1654096817291-tumblr_532c854928b4d7b658e3bc7ed704514d_189a97e1_250.png"
            alt=""
          >
          <div class="audio__list-info-song">
            <h3 class="audio__list-author-songname">
              song_name
            </h3>
            <h4 class="audio__list-author-name">
              author_name
            </h4>
          </div>
        </div>
        <div class="audio__list-block audio__list-data">
          <div class="audio__list-songtime">
            1:31
          </div>
          <div class="audio__list-favorite">
            <vStar :class-names="['audio__list-favorite-icon']" />
            <span class="audio__list-favorite-count">31</span>
          </div>
        </div>
        <div class="audio__list-block audio__list-options">
          <button class="audio__list-options-btn"></button>
        </div>
      </li>
    </ul>
    <!-- <vNothing v-else /> -->
  </div>
</template>

<script>
  import vNothing from "@/components/general/vNothing";
  import vStar from "@/components/icons/vStar";

  export default {
    name: "ProfileArtistsComponent",
    components: {
      vNothing,
      vStar,
    },
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data() {
      return { songs: [], };
    },
    async fetch() {
      try {
        const { id, } = this.user;
        const token = this.$store.getters["auth/getToken"];
        const { ok, songs, } = await this.$store.dispatch("profile/getAudio", { userId: id, token, });
      
        if (ok) {
          this.songs = songs;
        }
      } catch (err) {
        throw err;
      }
    },
  };
</script>