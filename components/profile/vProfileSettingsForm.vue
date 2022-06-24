<template>
  <client-only>
    <form
      class="form profile__form"
      method="POST"
      enctype="multipart/form-data"
      @submit.prevent="edit"
    >
      <div class="form__field profile__form-field">
        <label
          class="form__label form__block-avatar profile__form-label profile__form-block-avatar"
          for="avatar"
        >
          <input
            id="avatar"
            class="form__input profile__form-file input__file"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            name="avatar"
            @change="loadAvatar($event)"
          >
          <span
            v-if="!avatar.src"
            class="form__file-style profile__form-file-style input__file-style"
          >
            Изменить фотографию
          </span>
          <img
            v-if="avatar.src"
            class="form__avatar profile__form-avatar"
            :src="avatar.src"
            alt=""
          >
        </label>
      </div>
      <div class="form__field profile__form-field">
        <label
          class="form__label profile__form-label"
          for="username"
        >
          <h4 class="form__field-title profile__form-field-title">Имя пользователя</h4>
          <input
            id="username"
            v-model.trim="validations.name.model"
            class="form__input profile__form-input input"
            type="text"
            placeholder="Написать имя"
            name="name"
            :class="{ 'input--invalid': validations.name.$invalid }"
          >
        </label>
      </div>
      <div class="form__field profile__form-field">
        <label
          class="form__label profile__form-label"
          for="email"
        >
          <h4 class="form__field-title profile__form-field-title">Email пользователя</h4>
          <input
            id="email"
            v-model.trim="validations.email.model"
            class="form__input profile__form-input input"
            type="text"
            placeholder="Написать email"
            name="email"
            :class="{ 'input--invalid': validations.email.$invalid }"
          >
        </label>
      </div>
      <div class="form__field profile__form-field">
        <label
          class="form__label profile__form-label"
          for="password"
        >
          <h4 class="form__field-title profile__form-field-title">Пароль пользователя</h4>
          <input
            id="password"
            v-model.trim="validations.password.model"
            class="form__input profile__form-input input"
            type="password"
            placeholder="Написать пароль"
            name="password"
            :class="{ 'input--invalid': validations.password.$invalid }"
          >
        </label>
      </div>
      <div class="form__field profile__form-field">
        <label
          class="form__label profile__form-label"
          for="repeatPassword"
        >
          <h4 class="form__field-title profile__form-field-title">Повторить пароль</h4>
          <input
            id="repeatPassword"
            v-model.trim="validations.password.model"
            class="form__input profile__form-input input"
            type="password"
            placeholder="Написать пароль еще раз"
            name="repeatPassword"
            :class="{ 'input--invalid': validations.repeatPassword.$invalid }"
          >
        </label>
      </div>
      <button
        class="form__submit profile__form-submit"
        type="submit"
        :disabled="pending"
      >
        Сохранить
      </button>
    </form>
  </client-only>
</template>

<script>
  export default {
    name: "ProfileSettingsFormComponent",
    props: {
      pending: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        user: {},
        avatar: {
          file: {},
          src: "",
        },
        validations: {
          name: {
            rules: {
              maxLength: 16,
              minLength: 4,
            },
            model: "",
          },
          email: {
            rules: { email: true, },
            model: "",
          },
          password: {
            rules: { minLength: 6, },
            model: "",
          },
          repeatPassword: {
            rules: { sameAs: "password", },
            model: "",
          },
        },
      };
    },

    async fetch() {
      try {
        const { ok, user, } = await this.$store.dispatch("auth/getUser");

        if (ok) {
          Object.keys(this.validations).map((key) => {
            if (key in user && !["password"].includes(key)) {
              this.validations[key].model = user[key];
            }
          });
        }
      } catch (err) {
        throw err;
      }
    },

    methods: {
      loadAvatar(e) {
        if (window.FileReader) {
          const file = e.currentTarget.files[0];

          if (file) {
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
              this.avatar = {
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
        if (!this.validations.$invalid) {
          this.$emit("edit", {
            name: this.validations.name.model,
            email: this.validations.email.model,
            password: this.validations.password.model,
            avatar: this.avatar.file instanceof File ? this.avatar.file : null,
          });
        } else {
          alert("Все поля должны быть заполнены верно");
        }
      },
    },
  };
</script>