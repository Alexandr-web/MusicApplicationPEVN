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
  import vNothing from "@/components/general/vNothing";
  import vAudio from "@/components/general/vAudio";
  import getValidAudioAndPosterUrlMixin from "@/mixins/getValidAudioAndPosterUrlMixin";
  import setNewAudioMixin from "@/mixins/setNewAudioMixin";

  export default {
    name: "ProfileArtistsComponent",
    components: {
      vNothing,
      vAudio,
    },
    mixins: [getValidAudioAndPosterUrlMixin, setNewAudioMixin],
    data() {
      return { songs: [], };
    },
    async fetch() {
      try {
        const { id, } = this.$route.params;

        if (id) {
          const token = this.$store.getters["auth/getToken"];
          const { ok, songs, } = await this.$store.dispatch("profile/getAudio", { userId: parseInt(id), token, });
          
          if (ok) {
            this.$store.commit("audio/setPlaylist", songs);
            this.songs = songs;
          }
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
      getPlaylist() {
        return this.$store.getters["audio/getPlaylist"];
      },
    },
    methods: {
      setAudio(audioData) {
        if (this.getAudioData && this.getAudioData.id === audioData.id) {
          this.$store.commit("audio/setPlay", !this.getPlay);
        } else {
          this.setActiveAudio(audioData);
        }
      },
      async removeAudio({ id, }) {
        try {
          const token = this.$store.getters["auth/getToken"];
          const { ok, message, } = await this.$store.dispatch("audio/remove", { audioId: id, token, });

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