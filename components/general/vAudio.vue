<template>
  <li
    class="audio__list-item"
    :class="{ 'audio__list-item--active': isActiveAudio }"
    @click.stop="$emit('setActiveAudio', audio)"
  >
    <div class="audio__list-block audio__list-info">
      <img
        v-if="!noPoster"
        class="audio__list-poster"
        :src="posterUrl"
        alt=""
      >
      <div class="audio__list-info-song">
        <h3 class="audio__list-author-songname">
          {{ audio.name }}
        </h3>
        <h4 class="audio__list-author-name">
          {{ audio.author }}
        </h4>
      </div>
    </div>
    <div class="audio__list-block audio__list-data">
      <div class="audio__list-songtime">
        {{ audio.time }}
      </div>
      <div class="audio__list-favorite">
        <vStarIcon :class-names="['audio__list-favorite-icon']" />
        <span class="audio__list-favorite-count">{{ audio.likes.length }}</span>
      </div>
    </div>
    <div class="audio__list-block audio__list-options">
      <button
        class="audio__list-options-btn add-btn add-btn--remove"
        @click.stop="$emit('remove', audio)"
      ></button>
    </div>
  </li>
</template>

<script>
  import getValidAudioAndPosterUrlMixin from "@/mixins/getValidAudioAndPosterUrlMixin";
  import vStarIcon from "@/components/icons/vStarIcon";

  export default {
    name: "AudioComponent",
    components: { vStarIcon, },
    mixins: [getValidAudioAndPosterUrlMixin],
    props: {
      audio: {
        type: Object,
        required: true,
      },
      noPoster: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return { posterUrl: "", };
    },
    computed: {
      getAudioData() {
        return this.$store.getters["audio/getAudioData"];
      },
      isActiveAudio() {
        return this.getAudioData && this.getAudioData.id === this.audio.id;
      },
    },
    async mounted() {
      const { poster, } = this.audio;
      
      this.posterUrl = await this.getValidAudioAndPosterUrl(poster);
    },
  };
</script>