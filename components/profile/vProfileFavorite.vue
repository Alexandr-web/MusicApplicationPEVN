<template>
  <div class="profile__tab-block profile__tab-favorite">
    <ul
      v-if="songs.length"
      class="audio__list"
    >
      <vAudio
        v-for="(audio, index) in songs"
        :key="index"
        :audio="audio"
        :no-controls="true"
        @setActiveAudio="setAudio"
      />
    </ul>
    <vNothing v-else />
  </div>
</template>

<script>
  import vNothing from "@/components/general/vNothing";
  import setNewAudioMixin from "@/mixins/setNewAudioMixin";
  import vAudio from "@/components/general/vAudio";

  export default {
    name: "ProfileFavoriteAudioComponent",
    components: {
      vNothing,
      vAudio,
    },
    mixins: [setNewAudioMixin],
    data() {
      return { songs: [], };
    },
    async fetch() {
      try {
        const token = this.$store.getters["auth/getToken"];
        const { ok, audio, } = await this.$store.dispatch("audio/getFavorite", { token, });

        if (ok) {
          this.songs = audio;
          this.$store.commit("audio/setPlaylist", audio);
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
    },
  };
</script>