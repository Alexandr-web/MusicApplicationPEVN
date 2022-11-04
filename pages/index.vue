<template>
  <div class="gaps-t-b home">
    <div class="container">
      <div class="home__inner">
        <div class="home__column">
          <h1 class="title home__column-title">
            Плейлисты
          </h1>
          <clientOnly v-if="playlists.length">
            <Swiper
              class="swiper__wrapper"
              :options="sliderOptions"
            >
              <SwiperSlide
                v-for="(playlist, index) in playlists"
                :key="index"
                class="slider__slide"
              >
                <vPlaylist
                  :playlist="playlist"
                  @setPlaylist="setPlaylist"
                />
              </SwiperSlide>
            </Swiper>
          </clientOnly>
          <vNothing v-else />
          <vPlaylistModal 
            v-if="Object.keys(objectPlaylist).length"
            :playlist="objectPlaylist"
            :show="showPlaylistModal"
            @hide="showPlaylistModal = false"
            @removePlaylist="removePlaylist"
          />
        </div>
        <div class="home__column">
          <h1 class="title home__column-title">
            Аудио
          </h1>
          <ul
            v-if="songs.length"
            class="audio__list"
          >
            <vAudio
              v-for="(audio, indexAudio) in songs"
              :key="indexAudio"
              :audio="audio"
              :no-controls="true"
              @setActiveAudio="setAudio"
            />
          </ul>
          <vNothing v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperSlide, } from "vue-awesome-swiper";
  import vPlaylist from "@/components/vPlaylist";
  import vPlaylistModal from "@/components/vPlaylistModal";
  import vNothing from "@/components/vNothing";
  import getValidPlaylistPosterMixin from "@/mixins/getValidPlaylistPosterMixin";
  import vAudio from "@/components/vAudio";
  import setNewAudioMixin from "@/mixins/setNewAudioMixin";
  import playlistModalControlsMixin from "@/mixins/playlistModalControlsMixin";

  export default { 
    name: "MainPage",
    components: {
      vPlaylist,
      vPlaylistModal,
      vNothing,
      Swiper,
      SwiperSlide,
      vAudio,
    },
    mixins: [getValidPlaylistPosterMixin, setNewAudioMixin, playlistModalControlsMixin],
    layout: "default",
    data() {
      return {
        sliderOptions: {
          slidesPerView: 3,
          speed: 500,
          grabCursor: true,
          spaceBetween: 10,
        },
        playlists: [],
        songs: [],
      };
    },
    // Get all songs and playlists
    async fetch() {
      try {
        const token = this.$store.getters["auth/getToken"];
        const { ok: completePlaylists, playlists, } = await this.$store.dispatch("playlist/getAll", { token, });
        const { ok: completeAudio, audio, } = await this.$store.dispatch("audio/getAll", { token, });

        if (completePlaylists) {
          playlists.map((playlist) => {
            this.getValidPlaylistPoster(playlist.poster).then((url) => {
              this.playlists.push({ ...playlist, poster: url, });
            }).catch((err) => {
              throw err;
            });
          });
        }
        
        if (completeAudio) {
          this.songs = audio;
          this.$store.commit("playlist/setPlaylist", audio);
        }
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Главная", },
    computed: {
      getPlaylist() {
        return this.$store.getters["playlist/getPlaylist"];
      },
    },
    watch: {
      showPlaylistModal(val) {
        document.documentElement.style.overflow = val ? "hidden" : "visible";
      },
    },
  };
</script>