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
  import vPlaylist from "@/components/general/vPlaylist";
  import vPlaylistModal from "@/components/playlist/vPlaylistModal";
  import vNothing from "@/components/general/vNothing";
  import getValidPlaylistPosterMixin from "@/mixins/getValidPlaylistPosterMixin";
  import vAudio from "@/components/general/vAudio";
  import setNewAudioMixin from "@/mixins/setNewAudioMixin";

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
    mixins: [getValidPlaylistPosterMixin, setNewAudioMixin],
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
        objectPlaylist: {},
        showPlaylistModal: false,
      };
    },
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
          this.$store.commit("audio/setPlaylist", audio);
        }
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Главная", },
    computed: {
      getAudioData() {
        return this.$store.getters["audio/getAudioData"];
      },
      getPlay() {
        return this.$store.getters["audio/getPlay"];
      },
      getPlaylist() {
        return this.$store.getters["audio/getPlaylist"];
      },
    },
    watch: {
      showPlaylistModal(val) {
        document.documentElement.style.overflow = val ? "hidden" : "visible";
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
      setPlaylist(playlist) {
        const playlistAudioFetch = this.$store.dispatch("playlist/getAudio", { playlistId: playlist.id, });

        this.$store.commit("audio/setPlaylist", []);
        this.objectPlaylist = {};

        playlistAudioFetch.then(({ ok, audio, }) => {
          if (ok) {
            this.$store.commit("audio/setPlaylist", audio);
            this.objectPlaylist = playlist;
            this.showPlaylistModal = true;
          }
        }).catch((err) => {
          throw err;
        });
      },
      async removePlaylist({ id: playlistId, }) {
        try {
          const token = this.$store.getters["auth/getToken"];
          const { ok, message, } = await this.$store.dispatch("playlist/remove", { token, playlistId, });

          alert(message);

          if (ok) {
            this.$router.go(0);
          }
        } catch (err) {
          throw err;
        }
      },
    },
  };
</script>