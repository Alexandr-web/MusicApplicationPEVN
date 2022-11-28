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
          @change="loadFile($event)"
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
            <ul class="list-audio-column">
              <vAudio
                v-for="(song, index) in audio"
                :key="index"
                :is-remove="song.have"
                :audio="song"
                @setActiveAudio="$store.dispatch('audio/setActionForAudio', song)"
                @remove="$emit('setStateAudioAtPlaylist', song)"
              />
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
  import vAudio from "@/components/vAudio";

  export default {
    name: "AddPlaylistFormComponent",
    components: { vAudio, },
    props: {
      pending: {
        type: Boolean,
        required: true,
      },
      audio: {
        type: Array,
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
      };
    },
    computed: {
      getAddedSongsId() {
        return this.audio.filter(({ have, }) => have).map(({ id, }) => id);
      },
    },
    methods: {
      // Sends an emit with playlist data for its further addition
      addPlaylist() {
        if ([...Object.values(this.poster), this.validations.name.model, this.getAddedSongsId.length].every(Boolean)) {
          this.$emit("add", {
            poster: this.poster.file,
            audio: JSON.stringify(this.getAddedSongsId),
            name: this.validations.name.model,
          });
        } else {
          alert("Все поля должны быть заполнены");
        }
      },
      /**
       * Uploading a poster file
       * @param {object} e Event object
       */
      loadFile(e) {
        if (window.FileReader) {
          const file = e.currentTarget.files[0];

          if (file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
              this.poster = {
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