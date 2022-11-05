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
  import vNothing from "@/components/vNothing";
  import audioControlsMixin from "@/mixins/audioControlsMixin";
  import vAudio from "@/components/vAudio";

  export default {
    name: "ProfileFavoriteAudioComponent",
    components: {
      vNothing,
      vAudio,
    },
    mixins: [audioControlsMixin],
    data() {
      return { songs: [], };
    },
    // Getting favorite songs
    async fetch() {
      try {
        const token = this.$store.getters["auth/getToken"];
        const { id, } = this.getUser;
        const { ok, audio, } = await this.$store.dispatch("profile/getFavorites", { token, id, });

        if (ok) {
          this.songs = audio;
          this.$store.commit("playlist/setPlaylist", audio);
        }
      } catch (err) {
        throw err;
      }
    },
    computed: {
      getPlaylist() {
        return this.$store.getters["playlist/getPlaylist"];
      },
      getUser() {
        return this.$store.getters["profile/getUser"];
      },
    },
  };
</script>