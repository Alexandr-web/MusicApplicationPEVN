<template>
  <div class="default__layout">
    <vHeader />
    <vSidebar />
    <main class="main-content">
      <Nuxt />
      <vAudioplayer
        v-if="getAudioData"
        :audio-data="getAudioData"
        :play="getPlay"
        :current-time="getCurrentTime"
        :volume="getVolume"
        @stateAudio="stateAudio"
        @setTime="setTime"
        @setVolume="setVolume"
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
      getPlay() {
        return this.$store.getters["audio/getPlay"];
      },
      getCurrentTime() {
        return this.$store.getters["audio/getCurrentTime"];
      },
      getVolume() {
        return this.$store.getters["audio/getVolume"];
      },
    },
    methods: {
      stateAudio(val) {
        this.$store.commit("audio/setPlay", val);
      },
      setTime(val) {
        this.$store.commit("audio/setAudioProp", { key: "currentTime", val, });
      },
      setVolume(val) {
        this.$store.commit("audio/setVolume", val);
      },
    },
  };
</script>