<template>
  <div class="playlist__edit">
    <div class="playlist__edit-top">
      <div class="playlist__edit-column playlist__edit-column-poster">
        <div class="playlist__edit-poster">
          <label
            class="playlist__edit-poster-label"
            for="poster"
          >
            <input
              id="poster"
              class="playlist__edit-input-file input__file"
              type="file"
              name="poster"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              @change="loadPoster($event)"
            >
            <img
              v-if="posterPlaylist.src"
              class="playlist__edit-poster-image"
              :src="posterPlaylist.src"
              :alt="playlist.name"
            >
          </label>
        </div>
      </div>
      <div class="playlist__edit-column playlist__edit-column-info">
        <div class="playlist__edit-info">
          <div class="playlist__edit-info-field">
            <label
              class="playlist__edit-info-label"
              for="name"
            >
              <input
                id="name"
                v-model.trim="$v.name.$model"
                class="playlist__edit-input input"
                type="text"
                name="name"
                placeholder="Название"
                :class="{ 'input--invalid': $v.name.$invalid }"
              >
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="playlist__edit-bottom">
      <ul class="playlist__edit-audio-list">
        <li
          v-for="(song, index) in audio"
          :key="index"
          class="playlist__edit-audio"
          @click.stop="$emit('setAudio', song)"
        >
          <div class="playlist__edit-audio-block">
            <div class="playlist__edit-audio-authorname">
              {{ song.author }}
            </div>
            <div class="playlist__edit-audio-songname">
              {{ song.name }}
            </div>
          </div>
          <div class="playlist__edit-audio-block">
            <div class="playlist__edit-audio-time">
              {{ song.time }}
            </div>
            <button
              class="playlist__edit-audio-btn add-btn"
              :class="{
                'add-btn--add': !song.have,
                'add-btn--remove': song.have,
              }"
              @click.stop="$emit('setStateAudioAtPlaylist', song)"
            ></button>
          </div>
        </li>
      </ul>
      <button
        class="playlist__edit-submit form__submit"
        :disabled="pending"
        @click="edit"
      >
        Изменить
      </button>
    </div>
  </div>
</template>

<script>
  import getValidPlaylistPosterMixin from "@/mixins/getValidPlaylistPosterMixin";
  import {
    required,
    minLength,
    maxLength,
  } from "vuelidate/lib/validators";

  export default {
    name: "FormEditPlaylistComponent",
    mixins: [getValidPlaylistPosterMixin],
    props: {
      playlist: {
        type: Object,
        required: true,
      },
      pending: {
        type: Boolean,
        required: true,
      },
      audio: {
        type: Array,
        required: true,
      },
    },
    validations: {
      name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(25),
      },
    },
    data() {
      return {
        posterPlaylist: {
          file: {},
          res: "",
        },
      };
    },
    mounted() {
      this.getValidPlaylistPoster(this.playlist.poster).then((url) => {
        this.posterPlaylist = { file: {}, src: url, };
      }).catch((err) => {
        throw err;
      });
    },
    methods: {
      loadPoster(e) {
        if (window.FileReader) {
          const file = e.currentTarget.files[0];

          if (file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
              this.posterPlaylist = {
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
      edit() {
        this.$v.$touch();

        if ([this.posterPlaylist.src, this.$v.name.$model, this.audio.filter((audio) => audio.have).length].every(Boolean)) {
          this.$emit("edit", {
            name: this.$v.name.$model,
            poster: this.posterPlaylist.file instanceof File ? this.posterPlaylist.file : this.posterPlaylist.src,
            audio: JSON.stringify(this.audio.filter(({ have, }) => have).map(({ id, }) => id)),
          });
        } else {
          alert("Все поля и данные должны быть заполнены");
        }
      },
    },
  };
</script>