<template>
  <div
    v-if="getAudioData && getAudio"
    class="audioplayer"
  >
    <div class="audioplayer__inner">
      <audio
        ref="audio"
        :src="getAudio"
        class="audioplayer__audio"
        @timeupdate="ontimeupdate"
        @ended="endAudio"
      ></audio>
      <div class="audioplayer__section audioplayer__info">
        <div class="audioplayer__poster">
          <img
            class="audioplayer__poster-image"
            :src="getAudioData.poster"
            alt="2nd hand"
          >
        </div>
        <div class="audioplayer__info-column">
          <h3 class="audioplayer__songname">
            {{ getAudioData.name }}
          </h3>
          <h4 class="audioplayer__authorname">
            {{ getAudioData.author }}
          </h4>
        </div>
        <button
          class="audioplayer__favorite-btn"
          @click="setFavorite(getAudioData)"
        >
          <vStarIcon :class-names="['audioplayer__favorite-icon', isFavoriteSong && 'audioplayer__favorite-icon--active']" />
        </button>
      </div>
      <div class="audioplayer__section audioplayer__controls">
        <div class="audioplayer__controls-top">
          <div class="audioplayer__controls-buttons">
            <button
              class="audioplayer__controls-btn"
              @click="setNewAudio(true)"
            >
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
            <button
              class="audioplayer__controls-btn"
              @click="setNewAudio()"
            >
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
              :style="`width: ${Math.ceil((getCurrentTime / getAudioData.duration) * 100)}%`"
            ></div>
          </div>
          <div class="audioplayer__time">
            {{ getAudioData.time }}
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
  import setActiveAudioMixin from "@/mixins/setNewAudioMixin";

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
    mixins: [getAudioTimeMixin, setActiveAudioMixin],
    data() {
      return {
        user: {},
        touch: false,
        isFavoriteSong: false,
        range: {
          x: null,
          width: null,
        },
      };
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
      getAudioData() {
        return this.$store.getters["audio/getAudioData"];
      },
      getPlaylist() {
        return this.$store.getters["audio/getPlaylist"];
      },
    },
    watch: {
      getPlay(play) {
        this.setAudioState(play);
      },
      getAudio() {
        this.setAudioState(this.getPlay);
        this.checkFavorite();
      },
      getVolume(val) {
        this.$refs.audio.volume = val;
      },
    },
    mounted() {
      this.checkFavorite();
      this.setAudioState(this.getPlay);
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
      async checkFavorite() {
        try {
          const { ok, user: { id: userId, }, } = await this.$store.dispatch("auth/getUser");
          
          if (ok) {
            this.isFavoriteSong = this.getAudioData.likes.includes(userId);
          }
        } catch (err) {
          throw err;
        }
      },
      async setFavorite({ id: audioId, }) {
        try {
          const token = this.$store.getters["auth/getToken"];
          const { user: { id: userId, }, } = await this.$store.dispatch("auth/getUser");
          const { ok, isFavorite, } = await this.$store.dispatch("audio/setFavorite", { audioId, token, userId, });

          if (ok) {
            this.isFavoriteSong = isFavorite;
          }
        } catch (err) {
          throw err;
        }
      },
      setAudioState(play) {
        const audio = this.$refs.audio;

        if (audio) {
          const promise = fetch(audio.src)
            .then((res) => res.blob())
            .then(() => audio.play());

          if (promise !== undefined) {
            promise.then(() => {
              audio[play ? "play" : "pause"]();
            })
            .catch((err) => {
              throw err;
            });
          }
        }
      },
      endAudio() {
        this.$store.commit("audio/setPlay", false);
        this.setNewAudio();
      },
      setNewAudio(setPrev) {
        const { id: activeAudioId, } = this.getAudioData;
        const findIndexActiveAudio = this.getPlaylist ? this.getPlaylist.findIndex(({ id, }) => id === activeAudioId) : -1;

        if (findIndexActiveAudio !== -1) {
          this.setActiveAudio(this.getPlaylist[this.checkNumActiveAudio(setPrev ? findIndexActiveAudio - 1 : findIndexActiveAudio + 1)]);
        }
      },
      checkNumActiveAudio(num) {
        if (num > this.getPlaylist.length - 1) {
          return 0;
        }

        if (num < 0) {
          return this.getPlaylist.length - 1;
        }

        return num;
      },
      setTime(e) {
        const width = e.currentTarget.offsetWidth;
        const percent = Math.ceil((e.layerX / width) * 100);
        const audio = this.$refs.audio;

        audio.currentTime = (percent * this.getAudioData.duration) / 100;
        this.$store.commit("audio/setCurrentTime", (percent * this.getAudioData.duration) / 100);
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