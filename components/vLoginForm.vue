<template>
  <form
    class="form auth__form" 
    @submit.prevent="$emit('login', {
      email: $v.email.$model,
      password: $v.password.$model,
    })"
  >
    <div class="form__field auth__form-field">
      <label
        class="form__label auth__form-label"
        for="email"
      >
        <h4 class="form__field-title auth__form-field-title">Email пользователя</h4>
        <input
          id="email"
          v-model.trim="$v.email.$model"
          class="form__input auth__form-input input"
          type="text"
          placeholder="Написать email"
          name="email"
          :class="{ 'input--invalid': $v.email.$invalid }"
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
          v-model.trim="$v.password.$model"
          class="form__input auth__form-input input"
          type="password"
          placeholder="Написать пароль"
          name="password"
          :class="{ 'input--invalid': $v.password.$invalid }"
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
  import {
    required,
    minLength,
    email,
  } from "vuelidate/lib/validators";

  export default {
    name: "LoginFormComponent",
    props: { pending: { type: Boolean, required: true, }, },
    data() {
      return { submitText: "Войти", };
    },
    validations: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(6),
      },
    },
  };
</script>