<template>
  <form
    class="form playlist__form"
    enctype="multipart/form-data"
    @submit.prevent="addPlaylist"
  >
    <div class="playlist__form-field form__field">
      <label
        class="playlist__form-label form__label"
        for="name"
      >
        <h4 class="playlist__form-title form__field-title">Название</h4>
        <input
          id="name"
          v-model.trim="validations.name.model"
          name="name"
          class="playlist__form-input form__input input"
          type="text"
          placeholder="Написать название"
          :class="{ 'input--invalid': validations.name.$invalid }"
        >
      </label>
    </div>
    <div class="playlist__form-field form__field">
      <label
        class="playlist__form-label playlist__form-block-poster form__label form__block-poster"
        for="poster"
      >
        <input
          id="poster"
          name="poster"
          class="playlist__form-file form__input input__file"
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          @change="loadFile($event, 'poster')"
        >
        <span class="playlist__form-file-style form__file-style input__file-style">Загрузить постер</span>
        <img
          v-if="poster.src"
          class="playlist__form-poster form__poster"
          :src="poster.src"
          alt=""
        >
      </label>
    </div>
    <div class="playlist__form-field form__field">
      <label
        class="playlist__form-label form__label"
        for="audio"
      >
        <h4
          class="playlist__form-title form__field-title"
        >
          Список аудио
        </h4>
        <div class="form__data">
          <main class="form__data-main">
            <ul
              v-if="audio.length"
              class="form__data-list"
            >
              <li
                v-for="(song, index) in audio"
                :key="index"
                class="form__data-list-item"
                :style="`background-image: url(${song.poster})`"
                @click.stop="setAudio(song)"
              >
                <div class="form__data-list-block">
                  <span class="form__data-list-text">{{ song.name }}</span>
                </div>
                <div class="form__data-list-block">
                  <button
                    class="form__data-list-btn add-btn"
                    type="button"
                    :class="{
                      'add-btn--remove': audioForPlaylist.includes(song.id),
                      'add-btn--add': !audioForPlaylist.includes(song.id),
                    }"
                    @click.stop="addAudio(song)"
                  ></button>
                </div>
              </li>
            </ul>
          </main>
        </div>
      </label>
    </div>
    <button
      class="playlist__form-submit form__submit"
      :disabled="pending"
      type="submit"
    >
      Добавить
    </button>
  </form>
</template>

<script>
  import setNewAudioMixin from "@/mixins/setNewAudioMixin";
  import getValidAudioAndPosterUrlMixin from "@/mixins/getValidAudioAndPosterUrlMixin";

  export default {
    name: "AddPlaylistFormComponent",
    mixins: [getValidAudioAndPosterUrlMixin, setNewAudioMixin],
    props: {
      pending: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        poster: {
          src: "",
          file: {},
        },
        validations: {
          name: {
            rules: {
              required: true,
              minLength: 4,
              maxLength: 25,
            },
            model: "",
          },
        },
        audio: [],
        audioForPlaylist: [],
      };
    },
    async fetch() {
      try {
        const token = this.$store.getters["auth/getToken"];
        const { id: userId, } = this.getUser;
        const { ok, songs, } = await this.$store.dispatch("profile/getAudioAndFavorite", { token, userId, });
        
        if (ok) {
          songs.map((song) => {
            this.getValidAudioAndPosterUrl(song.poster).then((url) => {
              this.audio.push({ ...song, poster: url, });
            }).catch((err) => {
              throw err;
            });
          });
        }
      } catch (err) {
        throw err;
      }
    },
    computed: {
      getAudioData() {
        return this.$store.getters["audio/getAudioData"];
      },
      getPlay() {
        return this.$store.getters["audio/getPlay"];
      },
      getUser() {
        return this.$store.getters["profile/getUser"];
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
      addPlaylist() {
        if ([...Object.values(this.poster), this.validations.name.model, this.audioForPlaylist.length].every(Boolean)) {
          this.$emit("add", {
            poster: this.poster.file,
            name: this.validations.name.model,
            audio: JSON.stringify(this.audioForPlaylist),
          });
        } else {
          alert("Все поля должны быть заполнены");
        }
      },
      addAudio(audio) {
        if (this.audioForPlaylist.includes(audio.id)) {
          this.audioForPlaylist = this.audioForPlaylist.filter((id) => id !== audio.id);
        } else {
          this.audioForPlaylist.push(audio.id);
        }
      },
      loadFile(e, fileName) {
        if (window.FileReader) {
          const file = e.currentTarget.files[0];

          if (file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
              this[fileName] = {
                file,
                src: reader.result,
              };
            });
            reader.addEventListener("error", () => {
              throw reader.error;
            });
          }
        } else {
          alert("В вашем браузере не поддерживается FileReader. Обновите его до последней версии или установите более современный");
        }
      },
    },
  };
</script>