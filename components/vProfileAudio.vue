<template>
  <div class="profile__tab-block profile__tab-audio">
    <ul
      v-if="songs.length"
      class="audio__list"
    >
      <vAudio
        v-for="(audio, index) in songs"
        :key="index"
        :audio="audio"
        @setActiveAudio="setAudio"
        @remove="removeAudio"
      />
      <li class="audio__list-item--add">
        <nuxt-link
          class="audio__list-item-link"
          to="/audio/add"
        >
          Добавить
        </nuxt-link>
      </li>
    </ul>
    <vNothing
      v-else
      :link="{
        to: '/audio/add',
        text: 'Добавить'
      }"
    />
  </div>
</template>

<script>
  import vNothing from "@/components/vNothing";
  import vAudio from "@/components/vAudio";
  import getValidAudioAndPosterUrlMixin from "@/mixins/getValidAudioAndPosterUrlMixin";
  import audioControlsMixin from "@/mixins/audioControlsMixin";

  export default {
    name: "ProfileArtistsComponent",
    components: {
      vNothing,
      vAudio,
    },
    mixins: [getValidAudioAndPosterUrlMixin, audioControlsMixin],
    data() {
      return { songs: [], };
    },
    /**
     * Getting user's songs
     * Note: getting songs not from current user, but from user with param id
     */
    async fetch() {
      try {
        const { id, } = this.$route.params;

        if (id) {
          const token = this.$store.getters["auth/getToken"];
          const { ok, songs, } = await this.$store.dispatch("profile/getAudio", { userId: parseInt(id), token, });
          
          if (ok) {
            this.$store.commit("playlist/setPlaylist", songs);
            this.songs = songs;
          }
        }
      } catch (err) {
        throw err;
      }
    },
    computed: {
      getPlaylist() {
        return this.$store.getters["playlist/getPlaylist"];
      },
    },
  };
</script>