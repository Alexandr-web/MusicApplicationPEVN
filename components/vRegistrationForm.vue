<template>
  <form
    class="form auth__form" 
    enctype="multipart/form-data"
    method="POST"
    @submit.prevent="registration"
  >
    <div class="form__field auth__form-field">
      <label
        class="form__label form__block-avatar auth__form-label auth__form-block-avatar"
        for="avatar"
      >
        <input
          id="avatar"
          class="form__input auth__form-file input__file"
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          name="avatar"
          @change="loadAvatar($event)"
        >
        <span
          v-if="!avatar.src"
          class="form__file-style auth__form-file-style input__file-style"
        >
          Загрузить фотографию
        </span>
        <img
          v-if="avatar.src"
          class="form__avatar auth__form-avatar"
          :src="avatar.src"
          alt=""
        >
      </label>
    </div>
    <div class="form__field auth__form-field">
      <label
        class="form__label auth__form-label"
        for="username"
      >
        <h4 class="form__field-title auth__form-field-title">Имя пользователя</h4>
        <input
          id="username"
          v-model.trim="validations.name.model"
          class="form__input auth__form-input input"
          type="text"
          placeholder="Написать имя"
          name="name"
          :class="{ 'input--invalid': validations.name.$invalid }"
        >
      </label>
    </div>
    <div class="form__field auth__form-field">
      <label
        class="form__label auth__form-label"
        for="email"
      >
        <h4 class="form__field-title auth__form-field-title">Email пользователя</h4>
        <input
          id="email"
          v-model.trim="validations.email.model"
          class="form__input auth__form-input input"
          type="text"
          placeholder="Написать email"
          name="email"
          :class="{ 'input--invalid': validations.email.$invalid }"
        >
      </label>
    </div>
    <div class="form__field auth__form-field">
      <label
        class="form__label auth__form-label"
        for="password"
      >
        <h4 class="form__field-title auth__form-field-title">Пароль пользователя</h4>
        <input
          id="password"
          v-model.trim="validations.password.model"
          class="form__input auth__form-input input"
          type="password"
          placeholder="Написать пароль"
          name="password"
          :class="{ 'input--invalid': validations.password.$invalid }"
        >
      </label>
    </div>
    <div class="form__field auth__form-field">
      <label
        class="form__label auth__form-label"
        for="repeatPassword"
      >
        <h4 class="form__field-title auth__form-field-title">Повторить пароль</h4>
        <input
          id="repeatPassword"
          v-model.trim="validations.repeatPassword.model"
          class="form__input auth__form-input input"
          type="password"
          placeholder="Написать пароль еще раз"
          name="repeatPassword"
          :class="{ 'input--invalid': validations.repeatPassword.$invalid }"
        >
      </label>
    </div>
    <button
      class="form__submit auth__form-submit"
      :disabled="pending"
      type="submit"
    >
      {{ submitText }}
    </button>
  </form>
</template>

<script>
  export default {
    name: "RegistrationFormComponent",
    props: { pending: { type: Boolean, required: true, }, },
    data() {
      return {
        submitText: "Зарегистрироваться",
        avatar: {
          file: {},
          src: "",
        },
        validations: {
          name: {
            rules: {
              required: true,
              minLength: 6,
              maxLength: 16,
            },
            model: "",
          },
          email: {
            rules: {
              required: true,
              email: true,
            },
            model: "",
          },
          password: {
            rules: {
              required: true,
              minLength: 6,
            },
            model: "",
          },
          repeatPassword: {
            rules: {
              required: true,
              sameAs: "password",
            },
            model: "",
          },
        },
      };
    },
    methods: {
      // Sends an emit with data for user registration
      registration() {
        if (!this.validations.$invalid && this.avatar.file instanceof File) {
          this.$emit("registration", {
            name: this.validations.name.model,
            email: this.validations.email.model,
            password: this.validations.password.model,
            avatar: this.avatar.file,
          });
        } else {
          alert("Все поля должны быть заполнены");
        }
      },
      /**
       * Uploading an avatar file
       * @param {object} e Event object
       */
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
    },
  };
</script>