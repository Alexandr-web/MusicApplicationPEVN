<template>
  <div class="gaps-t-b playlist">
    <div class="container">
      <div
        v-if="(audio || []).length"
        class="playlist__inner"
      >
        <vForm
          :classes="['playlist__form']"
          :fields="fields"
          :pending="pendingAdd"
          text-button="Добавить"
          @sendReq="add"
        >
          <template v-slot:additionalField>
            <div class="form__field">
              <h4 class="playlist__form-title form__field-title">Список аудио</h4>
              <div class="form__data">
                <main class="form__data-main">
                  <ul class="list-audio-column">
                    <vAudio
                      v-for="(song, index) in audio"
                      :key="index"
                      :is-remove="song.have"
                      :audio="song"
                      @setActiveAudio="$store.dispatch('audio/setActionForAudio', song)"
                      @remove="setStateAudioAtPlaylist(song)"
                    />
                  </ul>
                </main>
              </div>
            </div>
          </template>
        </vForm>
      </div>
    </div>
  </div>
</template>

<script>
  import vAudio from "@/components/vAudio";
  import vForm from "@/components/vForm";

  export default {
    name: "AddPlaylistPage",
    components: {
      vAudio,
      vForm,
    },
    layout: "default",
    // Gets all of the user's audio, including favorites
    async asyncData({ store, }) {
      try {
        const token = store.getters["auth/getToken"];
        const { id: userId, } = store.getters["profile/getUser"];
        const { ok, songs, } = await store.dispatch("profile/getAudioAndFavorite", { token, userId, });
        
        if (!ok) {
          return { audio: [], };
        }

        const songsPromises = songs.map((song) => {
          const pPoster = store.dispatch("audio/getValidAudioAndPosterUrl", song.poster);
          const pAudio = store.dispatch("audio/getValidAudioAndPosterUrl", song.audio);

          return Promise.all([pPoster, pAudio])
            .then(([poster, audio]) => ({ ...song, poster, audio, }))
            .catch((err) => {
              throw err;
            });
        });

        return Promise.all(songsPromises)
          .then((audio) => {
            store.commit("playlist/setPlaylist", audio);

            return {
              audio: audio.map((song) => {
                song.have = false;

                return song;
              }),
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
        fields: {
          name: {
            title: "Название",
            placeholder: "Написать название",
            matchRegexpStr: "^.{4,25}$",
            type: "text",
            required: true,
          },
          poster: {
            title: "Загрузить постер",
            accept: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
            type: "file",
            typeFile: "img",
            isPoster: true,
            required: true,
          },
        },
        pendingAdd: false,
      };
    },
    head: { title: "Добавление плейлиста", },
    computed: {
      getToken() {
        return this.$store.getters["auth/getToken"];
      },
      getAddedSongsId() {
        return this.audio.filter(({ have, }) => have).map(({ id, }) => id);
      },
    },
    methods: {
      /**
       * Deleting/Adding a Song to a Playlist
       * @param {object} song the song we want to add/remove
       */
      setStateAudioAtPlaylist(song) {
        const indexAudio = this.audio.findIndex(({ id, }) => id === song.id);
        
        this.$set(this.audio, indexAudio, { ...song, have: !song.have, });
      },
      /**
       * Handles an emit to add a playlist
       * @param {object} data playlist we want to add
       */
      add(data) {
        if (!Object.keys(this.fields).every((key) => key in data) || !this.getAddedSongsId.length) {
          alert("Все поля должны быть заполнены правильно");
          return;
        }

        const fd = new FormData();
        const token = this.getToken;
        const playlistData = {
          ...data,
          audio: JSON.stringify(this.getAddedSongsId),
        };

        Object.keys(playlistData).map((key) => {
          const item = playlistData[key];

          if (typeof item === "string") {
            fd.append(key, item);
          } else {
            fd.append(key, item["file" in item ? "file" : "model"]);
          }
        });
        
        const res = this.$store.dispatch("playlist/add", { token, fd, });

        this.pendingAdd = true;

        res.then(({ ok, message, }) => {
          this.pendingAdd = false;
          
          alert(message);

          if (ok) {
            this.$router.push("/");
          }
        }).catch((err) => {
          throw err;
        });
      }, 
    },
  };
</script>