<template>
  <div class="audioplayer">
    <div class="audioplayer__inner">
      <div class="audioplayer__section audioplayer__info">
        <div class="audioplayer__poster">
          <img
            class="audioplayer__poster-image"
            src="https://cdn.ananasposter.ru/image/cache/catalog/poster/music/80/23716-1000x830.jpg"
            alt="2nd hand"
          >
        </div>
        <div class="audioplayer__info-column">
          <h3 class="audioplayer__songname">
            2nd hand
          </h3>
          <h4 class="audioplayer__authorname">
            $uicideboy$
          </h4>
        </div>
        <button class="audioplayer__favorite-btn">
          <vStar :class-names="['audioplayer__favorite-icon']" />
        </button>
      </div>
      <div class="audioplayer__section audioplayer__controls">
        <div class="audioplayer__controls-top">
          <div class="audioplayer__controls-buttons">
            <button class="audioplayer__controls-btn">
              <vPrev :class-names="['audioplayer__controls-icon', 'audioplayer__controls-prev']" />
            </button>
            <button class="audioplayer__controls-btn">
              <!-- <vPlay :class-names="['audioplayer__controls-icon', 'audioplayer__controls-play']" /> -->
              <vPause :class-names="['audioplayer__controls-icon', 'audioplayer__controls-pause']" />
            </button>
            <button class="audioplayer__controls-btn">
              <vNext :class-names="['audioplayer__controls-icon', 'audioplayer__controls-next']" />
            </button>
          </div>
        </div>
        <div class="audioplayer__controls-bottom">
          <div class="audioplayer__time">
            00:00
          </div>
          <div class="audioplayer__progressbar">
            <div class="audioplayer__progressbar-line"></div>
          </div>
          <div class="audioplayer__time">
            02:00
          </div>
        </div>
      </div>
      <div class="audioplayer__section audioplayer__volume">
        <button class="audioplayer__volume-btn">
          <vVolume :class-names="['audioplayer__volume-icon']" />
        </button>
        <div class="audioplayer__volume-slider">
          <div class="audioplayer__volume-slider-line">
            <button class="audioplayer__volume-slider-end"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vStar from "@/components/icons/vStar";
  import vPlay from "@/components/icons/vPlay";
  import vPause from "@/components/icons/vPause";
  import vNext from "@/components/icons/vNext";
  import vPrev from "@/components/icons/vPrev";
  import vVolume from "@/components/icons/vVolume";

  export default {
    name: "AudioplayerComponent",
    components: {
      vStar,
      vPause,
      vPlay,
      vNext,
      vPrev,
      vVolume,
    },
  };
</script>