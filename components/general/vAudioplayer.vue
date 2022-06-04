<template>
  <div
    v-if="audioData"
    class="audioplayer"
  >
    <div class="audioplayer__inner">
      <div class="audioplayer__section audioplayer__info">
        <div class="audioplayer__poster">
          <img
            class="audioplayer__poster-image"
            :src="audioData.poster"
            alt="2nd hand"
          >
        </div>
        <div class="audioplayer__info-column">
          <h3 class="audioplayer__songname">
            {{ audioData.name }}
          </h3>
          <h4 class="audioplayer__authorname">
            {{ audioData.author }}
          </h4>
        </div>
        <button class="audioplayer__favorite-btn">
          <vStarIcon :class-names="['audioplayer__favorite-icon', isFavoriteSong() && 'audioplayer__favorite-icon']" />
        </button>
      </div>
      <div class="audioplayer__section audioplayer__controls">
        <div class="audioplayer__controls-top">
          <div class="audioplayer__controls-buttons">
            <button class="audioplayer__controls-btn">
              <vPrevIcon :class-names="['audioplayer__controls-icon', 'audioplayer__controls-prev']" />
            </button>
            <button
              class="audioplayer__controls-btn"
              @click="$emit('stateAudio', !play)"
            >
              <vPlayIcon
                v-if="!play"
                :class-names="['audioplayer__controls-icon', 'audioplayer__controls-play']"
              />
              <vPauseIcon
                v-else
                :class-names="['audioplayer__controls-icon', 'audioplayer__controls-pause']"
              />
            </button>
            <button class="audioplayer__controls-btn">
              <vNextIcon :class-names="['audioplayer__controls-icon', 'audioplayer__controls-next']" />
            </button>
          </div>
        </div>
        <div class="audioplayer__controls-bottom">
          <div class="audioplayer__time">
            {{ getValidTime(currentTime) }}
          </div>
          <div
            class="audioplayer__progressbar"
            @click="setTime($event)"
          >
            <div
              class="audioplayer__progressbar-line"
              :style="`width: ${Math.ceil((currentTime / audioData.duration) * 100)}%`"
            ></div>
          </div>
          <div class="audioplayer__time">
            {{ audioData.time }}
          </div>
        </div>
      </div>
      <div class="audioplayer__section audioplayer__volume">
        <button class="audioplayer__volume-btn">
          <vVolumeIcon :class-names="['audioplayer__volume-icon']" />
        </button>
        <div
          class="audioplayer__volume-slider"
          @click="setVolume($event)"
        >
          <div
            class="audioplayer__volume-slider-line"
            :style="`width: ${Math.ceil((volume / 1) * 100)}%`"
          >
            <button class="audioplayer__volume-slider-end"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vStarIcon from "@/components/icons/vStarIcon";
  import vPlayIcon from "@/components/icons/vPlayIcon";
  import vPauseIcon from "@/components/icons/vPauseIcon";
  import vNextIcon from "@/components/icons/vNextIcon";
  import vPrevIcon from "@/components/icons/vPrevIcon";
  import vVolumeIcon from "@/components/icons/vVolumeIcon";
  import getAudioTimeMixin from "@/mixins/getAudioTimeMixin";

  export default {
    name: "AudioplayerComponent",
    components: {
      vStarIcon,
      vPauseIcon,
      vPlayIcon,
      vNextIcon,
      vPrevIcon,
      vVolumeIcon,
    },
    mixins: [getAudioTimeMixin],
    props: {
      audioData: {
        type: Object,
        required: true,
      },
      play: {
        type: Boolean,
        required: true,
      },
      currentTime: {
        type: Number,
        required: true,
      },
      volume: {
        type: Number,
        required: true,
      },
    },
    data() {
      return { user: {}, };
    },
    async fetch() {
      try {
        const user = await this.$store.dispatch("auth/getUser");

        this.user = user;
      } catch (err) {
        throw err;
      }
    },
    methods: {
      isFavoriteSong() {
        return Object.keys(this.user).length && this.audioData.likes.some((id) => id === this.user.dataValues.id);
      },
      setTime(e) {
        const width = e.currentTarget.offsetWidth;
        const percent = Math.ceil((e.layerX / width) * 100);

        this.$emit("setTime", (percent * this.audioData.duration) / 100);
      },
      setVolume(e) {
        const width = e.currentTarget.offsetWidth;
        const percent = Math.ceil((e.layerX / width) * 100);

        this.$emit("setVolume", (percent * 1) / 100);
      },
    },
  };
</script>