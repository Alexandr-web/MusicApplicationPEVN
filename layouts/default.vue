<template>
  <div class="default__layout">
    <vHeader />
    <vSidebar />
    <main class="main-content">
      <Nuxt />
      <vAudioplayer
        v-if="getAudioData"
        :audio-data="getAudioData"
      />
    </main>
  </div>
</template>

<script>
  import vHeader from "@/components/vHeader";
  import vSidebar from "@/components/vSidebar";
  import vAudioplayer from "@/components/vAudioplayer";

  export default {
    name: "DefaultLayout",
    components: {
      vHeader,
      vSidebar,
      vAudioplayer,
    },
    middleware: "checkAuth",
    computed: {
      getAudioData() {
        return this.$store.getters["audio/getAudioData"];
      },
    },
  };
</script>