<template>
  <div class="gaps-t-b playlist">
    <div class="container">
      <div class="playlist__inner">
        <vForm
          v-if="Object.keys(playlist).length && audio.length"
          :fields="fields"
          :classes="['playlist__form']"
          text-button="Изменить"
          :pending="pendingEdit"
          @sendReq="edit"
        >
          <template v-slot:additionalField>
            <div class="form__field">
              <ul class="list-audio-column">
                <vAudio
                  v-for="(song, index) in audio"
                  :key="index"
                  :audio="song"
                  :is-remove="song.have"
                  @setActiveAudio="setAudio"
                  @remove="setStateAudioAtPlaylist(song)"
                />
              </ul>
            </div>
          </template>
        </vForm>
        <vNothing
          v-if="!audio.length"
          text="Нет аудио для создания плейлиста"
          :gaps="true"
          :link="{
            to: '/',
            text: 'Найти аудио',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import vNothing from "@/components/vNothing";
  import vForm from "@/components/vForm";
  import vAudio from "@/components/vAudio";

  export default {
    name: "EditPlaylistPage",
    components: {
      vForm,
      vNothing,
      vAudio,
    },
    layout: "default",
    // Checking if the playlist exists
    validate({ params: { id: playlistId, }, store, }) {
      const token = store.getters["auth/getToken"];
      const res = store.dispatch("playlist/getOne", { token, playlistId, });

      return res
        .then(({ ok, playlist, }) => ok && Boolean(playlist))
        .catch((err) => {
          throw err;
        });
    },
    // Getting data to change the playlist
    async asyncData({ store, params: { id: playlistId, }, }) {
      try {
        const token = store.getters["auth/getToken"];
        const { ok, audio, playlist, } = await store.dispatch("playlist/getDataForEditPlaylist", { token, playlistId, });

        if (!ok) {
          return {
            playlist: {},
            audio: [],
          };
        }

        const validPlaylistPoster = await store.dispatch("playlist/getValidPlaylistPoster", playlist.poster);
        const audioPromises = audio.map((song) => {
          const pPoster = store.dispatch("audio/getValidAudioAndPosterUrl", song.poster);
          const pAudio = store.dispatch("audio/getValidAudioAndPosterUrl", song.audio);

          return Promise.all([pPoster, pAudio])
            .then(([posterUrl, audioUrl]) => ({ ...song, poster: posterUrl, audio: audioUrl, }))
            .catch((err) => {
              throw err;
            });
        });

        // Processing all promises
        return Promise.all(audioPromises)
          .then((songs) => {
            // Parameters that will be in the form
            const fields = {
              name: {
                title: "Название",
                matchRegexpStr: "^.{4,25}$",
                type: "text",
                placeholder: "Написать название",
                model: playlist.name,
                required: true,
              },
              poster: {
                type: "file",
                typeFile: "img",
                accept: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
                title: "Загрузить постер",
                src: validPlaylistPoster,
                isPoster: true,
                required: true,
              },
            };

            // Change playlist
            store.commit("playlist/setPlaylist", songs);
            
            return {
              playlist: {
                ...playlist,
                poster: validPlaylistPoster,
              },
              audio: songs.map((song) => {
                // Playlist contains this song
                song.have = playlist.audio.includes(song.id);

                return song;
              }),
              fields,
            };
          }).catch((err) => {
            throw err;
          });
      } catch (err) {
        throw err;
      }
    },
    data() {
      return { pendingEdit: false, };
    },
    head: { title: "Изменение плейлиста", },
    computed: {
      getToken() {
        return this.$store.getters["auth/getToken"];
      },
      getAddedSongsId() {
        return this.audio.filter(({ have, }) => have).map(({ id, }) => id);
      },
    },
    methods: {
      setAudio(audioData) {
        this.$store.dispatch("audio/setActionForAudio", audioData);
      },
      /**
       * Deleting/Adding a Song to a Playlist
       * @param {object} audio the audio we want to add/remove
       */
      setStateAudioAtPlaylist(audio) {
        const indexAudio = this.audio.findIndex(({ id, }) => id === audio.id);
        
        this.$set(this.audio, indexAudio, { ...audio, have: !audio.have, });
      },
      /**
       * Handles an emit to change a playlist
       * @param {object} data data to be changed in the playlist
       */
      edit(data) {
        if (!Object.keys(data).length) {
          alert("Хотя бы одно поле должно быть заполнено");
          return;
        }

        const fd = new FormData();
        const token = this.getToken;
        const { id: playlistId, } = this.playlist;
        const playlistData = {
          ...data,
          audio: JSON.stringify(this.getAddedSongsId),
        };

        // Fill form data
        Object.keys(playlistData).map((key) => {
          const item = playlistData[key];

          if (typeof item !== "object") {
            fd.append(key, item);
          } else {
            const dataItem = item["file" in item ? "file" : "model"];

            if (dataItem) {
              fd.append(key, dataItem);
            }
          }
        });
        
        const res = this.$store.dispatch("playlist/edit", { token, playlistId, fd, });

        this.pendingEdit = true;

        res.then(({ ok, message, }) => {
          this.pendingEdit = false;
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