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
      />
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

  export default {
    name: "ProfileArtistsComponent",
    components: {
      vNothing,
      vAudio,
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