<template>
  <form
    class="form auth__form" 
    @submit.prevent="login"
  >
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
    name: "LoginFormComponent",
    props: {
      pending: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        submitText: "Войти",
        validations: {
          email: {
            rules: {
              required: true,
              email: true,
            },
            model: "",
          },
          password: {
            rules: {
              minLength: 6,
              required: true,
            },
            model: "",
          },
        },
      };
    },
    methods: {
      // Sends an emit with data for the user login
      login() {
        if (!this.validations.$invalid) {
          this.$emit("login", {
            email: this.validations.email.model,
            password: this.validations.password.model,
          });
        } else {
          alert("Все поля должны быть заполнены");
        }
      },
    },
  };
</script>