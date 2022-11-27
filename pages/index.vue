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
  import vAudio from "@/components/vAudio";
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
    mixins: [playlistModalControlsMixin],
    layout: "default",
    // Get all songs and playlists
    async asyncData({ store, }) {
      try {
        const token = store.getters["auth/getToken"];
        const { ok: completePlaylists, playlists, } = await store.dispatch("playlist/getAll", { token, });
        const { ok: completeAudio, audio, } = await store.dispatch("audio/getAll", { token, });

        if (!completePlaylists || !completeAudio) {
          return {
            playlists: [],
            songs: [],
          };
        }

        // Contains all playlists (promises) with the correct poster
        const playlistPromises = playlists.map((playlist) => {
          return store.dispatch("playlist/getValidPlaylistPoster", playlist.poster)
            .then((url) => ({ ...playlist, poster: url, }))
            .catch((err) => {
              throw err;
            });
        });

        const songsPromises = audio.map((song) => {
          const pPoster = store.dispatch("audio/getValidAudioAndPosterUrl", song.poster);
          const pAudio = store.dispatch("audio/getValidAudioAndPosterUrl", song.audio);

          return Promise.all([pPoster, pAudio])
            .then(([posterUrl, audioUrl]) => ({ ...song, poster: posterUrl, audio: audioUrl, isAudio: true, }))
            .catch((err) => {
              throw err;
            });
        });
        
        // Returns all playlists and audio when all promises are fulfilled
        return Promise.all([...playlistPromises, ...songsPromises])
          .then((data) => {
            const arrPlaylists = data.filter(({ isAudio, }) => !isAudio);
            const songs = data.filter(({ isAudio, }) => isAudio);

            store.commit("playlist/setPlaylist", songs);

            return {
              playlists: arrPlaylists,
              songs,
            };
          }).catch((err) => {
            throw err;
          });
      } catch (err) {
        throw err;
      }
    },
    data() {
      return {
        sliderOptions: {
          slidesPerView: 3,
          speed: 500,
          grabCursor: true,
          spaceBetween: 10,
        },
      };
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
    methods: {
      setAudio(audioData) {
        this.$store.dispatch("audio/setActionForAudio", audioData);
      },
    },
  };
</script>