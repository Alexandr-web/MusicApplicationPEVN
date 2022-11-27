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
                v-model.trim="validations.name.model"
                class="playlist__edit-input input"
                type="text"
                name="name"
                placeholder="Название"
                :class="{ 'input--invalid': validations.name.$invalid }"
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

  export default {
    name: "FormEditPlaylistComponent",
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
    data() {
      return {
        posterPlaylist: {
          file: {},
          res: "",
        },
        validations: {
          name: {
            rules: {
              minLength: 4,
              maxLength: 25,
              required: true,
            },
            model: "",
          },
        },
      };
    },
    // Sets the initial value of the parameters in the form
    mounted() {
      this.validations.name.model = this.playlist.name;

      this.$store.dispatch("playlist/getValidPlaylistPoster", this.playlist.poster)
        .then((url) => {
          this.posterPlaylist = { file: {}, src: url, };
        }).catch((err) => {
          throw err;
        });
    },
    methods: {
      /**
       * Uploading a poster file
       * @param {object} e Event object
       */
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
      // Sends an emit with modified playlist data if all required data is present
      edit() {
        if ([this.posterPlaylist.src, !this.validations.$invalid, this.audio.filter((audio) => audio.have).length].every(Boolean)) {
          this.$emit("edit", {
            name: this.validations.name.model,
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