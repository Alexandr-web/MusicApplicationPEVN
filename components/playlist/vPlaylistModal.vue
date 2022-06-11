<template>
  <div
    v-show="show"
    class="playlist-modal"
    @click="hideModal($event)"
  >
    <div class="playlist-modal__inner">
      <header class="playlist-modal__header">
        <div class="playlist-modal__poster">
          <img
            class="playlist-modal__poster-image"
            :src="playlist.poster"
            alt=""
          >
        </div>
        <div class="playlist-modal__info">
          <h3 class="playlist-modal__title">
            {{ playlist.name }}
          </h3>
          <ul class="playlist-modal__controls">
            <li class="playlist-modal__controls-item">
              <nuxt-link
                class="playlist-modal__controls-link playlist-modal__controls-link--edit"
                :to="`/playlist/edit/${playlist.id}`"
              >
                Изменить
              </nuxt-link>
            </li>
            <li
              class="playlist-modal__controls-item playlist-modal__controls-item--remove"
              @click="$emit('removePlaylist', playlist)"
            >
              Удалить
            </li>
          </ul>
        </div>
      </header>
      <main class="playlist-modal__main">
        <ul
          v-if="getPlaylist && getPlaylist.length"
          class="playlist-modal__list"
        >
          <vAudio
            v-for="(song, index) in getPlaylist"
            :key="index"
            :audio="song"
            @setActiveAudio="setAudio"
          />
        </ul>
      </main>
    </div>
  </div>
</template>

<script>
  import getValidPlaylistPosterMixin from "@/mixins/getValidPlaylistPosterMixin";
  import setNewAudioMixin from "@/mixins/setNewAudioMixin";
  import vAudio from "@/components/general/vAudio";

  export default {
    name: "PlaylistModalComponent",
    components: { vAudio, },
    mixins: [getValidPlaylistPosterMixin, setNewAudioMixin],
    props: {
      playlist: {
        type: Object,
        required: true,
      },
      show: {
        type: Boolean,
        required: true,
      },
    },
    computed: {
      getPlay() {
        return this.$store.getters["audio/getPlay"];
      },
      getAudioData() {
        return this.$store.getters["audio/getAudioData"];
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
      hideModal(e) {
        if (e.target.classList.contains("playlist-modal")) {
          this.$emit("hide");
        }
      },
    },
  };
</script>