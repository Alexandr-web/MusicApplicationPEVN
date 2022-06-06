<template>
  <div
    v-if="audioData"
    class="audioplayer"
  >
    <div class="audioplayer__inner">
      <audio
        v-if="getAudio"
        ref="audio"
        class="audioplayer__audio"
        :src="getAudio"
        @timeupdate="ontimeupdate"
      ></audio>
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
              @click="$store.commit('audio/setPlay', !getPlay)"
            >
              <vPlayIcon
                v-if="!getPlay"
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
            {{ getValidTime(getCurrentTime) }}
          </div>
          <div
            class="audioplayer__progressbar"
            @click="setTime($event)"
          >
            <div
              class="audioplayer__progressbar-line"
              :style="`width: ${Math.ceil((getCurrentTime / audioData.duration) * 100)}%`"
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
          @mousedown="touchSlider($event)"
        >
          <div
            class="audioplayer__volume-slider-line"
            :style="`width: ${Math.ceil((getVolume / 1) * 100)}%`"
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
    },
    data() {
      return {
        user: {},
        touch: false,
        range: {
          x: null,
          width: null,
        },
      };
    },
    async fetch() {
      try {
        const user = await this.$store.dispatch("auth/getUser");

        this.user = user;
      } catch (err) {
        throw err;
      }
    },
    computed: {
      getPlay() {
        return this.$store.getters["audio/getPlay"];
      },
      getCurrentTime() {
        return this.$store.getters["audio/getCurrentTime"];
      },
      getVolume() {
        return this.$store.getters["audio/getVolume"];
      },
      getAudio() {
        return this.$store.getters["audio/getAudio"];
      },
    },
    watch: {
      async getPlay(val) {
        await this.$refs.audio[val ? "play" : "pause"]();
      },
      getAudio(audio) {
        if (audio !== undefined) {
          this.$refs.audio.play().then(() => {
            this.$refs.audio.play();
          }).catch((err) => {
            throw err;
          });
        }
      },
      getVolume(val) {
        this.$refs.audio.volume = val;  
      },
    },
    mounted() {
      this.$refs.audio[this.getPlay ? "play" : "pause"]();
      this.$refs.audio.volume = this.getVolume;

      document.documentElement.addEventListener("mousemove", (e) => {
        if ([...Object.values(this.range), this.touch].every(Boolean)) {
          const pageX = e.pageX;
          
          if (this.range.x <= pageX && pageX <= this.range.x + this.range.width) {
            const percent = Math.ceil(((pageX - this.range.x) / this.range.width) * 100);
            const volume = (percent * 1) / 100;

            this.$store.commit("audio/setVolume", volume);
          }
        }
      });

      document.documentElement.addEventListener("mouseup", () => (this.touch = false));
    },
    methods: {
      isFavoriteSong() {
        return Object.keys(this.user).length && this.audioData.likes.some((id) => id === this.user.dataValues.id);
      },
      setTime(e) {
        const width = e.currentTarget.offsetWidth;
        const percent = Math.ceil((e.layerX / width) * 100);
        const audio = this.$refs.audio;

        audio.currentTime = (percent * this.audioData.duration) / 100;
        this.$store.commit("audio/setCurrentTime", (percent * this.audioData.duration) / 100);
      },
      setVolume(e) {
        if (e.target.classList.contains("audioplayer__volume-slider") || e.target.classList.contains("audioplayer__volume-slider-line")) {
          const width = e.currentTarget.offsetWidth;
          const percent = Math.ceil((e.layerX / width) * 100);

          this.$store.commit("audio/setVolume", (percent * 1) / 100);
        }
      },
      touchSlider(e) {
        this.touch = true;
        this.range.x = e.currentTarget.getBoundingClientRect().x;
        this.range = {
          x: e.currentTarget.offsetLeft,
          width: e.currentTarget.offsetWidth,
        };
      },
      ontimeupdate() {
        const audio = this.$refs.audio;

        this.$store.commit("audio/setCurrentTime", audio.currentTime);
      },
    },
  };
</script>