<template>
  <form
    class="audio__form form"
    enctype="multipart/form-data"
    @submit.prevent="add"
  >
    <div class="audio__form-field form__field">
      <label
        class="audio__form-label form__label"
        for="name"
      >
        <h4 class="audio__form-title form__field-title">Название</h4>
        <input
          id="name"
          v-model.trim="$v.name.$model"
          name="name"
          class="audio__form-input form__input input"
          type="text"
          placeholder="Написать название"
          :class="{ 'input--invalid': $v.name.$error }"
        >
      </label>
    </div>
    <div class="audio__form-field form__field">
      <label
        class="audio__form-label audio__form-block-poster form__label form__block-poster"
        for="poster"
      >
        <input
          id="poster"
          name="poster"
          class="audio__form-file form__input input__file"
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          @change="loadFile($event, 'poster')"
        >
        <span class="audio__form-file-style form__file-style input__file-style">Загрузить постер (jpeg, png, jpg, webp)</span>
        <img
          v-if="poster.src"
          class="audio__form-poster form__poster"
          :src="poster.src"
          alt=""
        >
      </label>
    </div>
    <div class="audio__form-field form__field">
      <label
        class="audio__form-label audio__form-block-audio form__label form__block-audio"
        for="audio"
      >
        <input
          id="audio"
          name="audio"
          class="audio__form-file form__input input__file"
          type="file"
          accept="audio/mp3,audio/ogg,audio/wav"
          @change="loadFile($event, 'audio')"
        >
        <span class="audio__form-file-style form__file-style input__file-style">Загрузить аудио файл (mp3, ogg, wav)</span>
        <audio
          v-if="audio.src"
          class="audio__form-audio form__audio"
          :src="audio.src"
          controls
        ></audio>
      </label>
    </div>
    <button
      class="audio__form-submit form__submit"
      :disabled="pending"
      type="submit"
    >
      Добавить
    </button>
  </form>
</template>

<script>
  import {
    required,
    minLength,
    maxLength,
  } from "vuelidate/lib/validators";
  import getAudioTimeMixin from "@/mixins/getAudioTimeMixin";

  export default {
    name: "AudioFormAddComponent",
    mixins: [getAudioTimeMixin],
    props: {
      pending: {
        type: Boolean,
        required: true,
      },
    },
    validations: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(30),
      },
    },
    data() {
      return {
        audio: {
          src: "",
          file: {},
        },
        poster: {
          src: "",
          file: {},
        },
      };
    },
    methods: {
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
      add() {
        const audio = document.createElement("audio");

        audio.src = this.audio.src;
        audio.addEventListener("loadedmetadata", () => {
          this.$emit("add", {
            name: this.$v.name.$model,
            poster: this.poster.file,
            audio: this.audio.file,
            time: this.getValidTime(audio.duration),
            duration: audio.duration,
          });
        });
      },
    },
  };
</script>