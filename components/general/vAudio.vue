<template>
  <li class="audio__list-item">
    <div class="audio__list-block audio__list-info">
      <img
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
        <vStar :class-names="['audio__list-favorite-icon']" />
        <span class="audio__list-favorite-count">{{ audio.likes.length }}</span>
      </div>
    </div>
    <div class="audio__list-block audio__list-options">
      <button class="audio__list-options-btn"></button>
    </div>
  </li>
</template>

<script>
  import getValidAudioAndPosterUrlMixin from "@/mixins/getValidAudioAndPosterUrlMixin";
  import vStar from "@/components/icons/vStar";

  export default {
    name: "AudioComponent",
    components: { vStar, },
    mixins: [getValidAudioAndPosterUrlMixin],
    props: {
      audio: {
        type: Object,
        required: true,
      },
    },
    data() {
      return { posterUrl: "", };
    },
    async mounted() {
      const { poster, } = this.audio;
      
      this.posterUrl = await this.getValidAudioAndPosterUrl(poster);
    },
  };
</script>