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
  import setThemeMixin from "@/mixins/setThemeMixin";
  import vHeader from "@/components/general/vHeader";
  import vSidebar from "@/components/general/vSidebar";
  import vAudioplayer from "@/components/general/vAudioplayer";

  export default {
    name: "DefaultLayout",
    components: {
      vHeader,
      vSidebar,
      vAudioplayer,
    },
    mixins: [setThemeMixin],
    middleware: "checkAuth",
    computed: {
      getAudioData() {
        return this.$store.getters["audio/getAudioData"];
      },
    },
  };
</script>