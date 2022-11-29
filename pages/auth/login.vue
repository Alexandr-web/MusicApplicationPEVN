<template>
  <vForm
    :classes="['auth__form']"
    :fields="fields"
    text-button="Войти"
    :pending="pendingLogin"
    @sendReq="login"
  />
</template>

<script>
  import vForm from "@/components/vForm";

  export default {
    name: "LoginPage",
    components: { vForm, },
    layout: "auth",
    data() {
      return {
        pendingLogin: false,
        fields: {
          email: {
            title: "Email пользователя",
            placeholder: "Написать email",
            type: "text",
            matchRegexpStr: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
            required: true,
          },
          password: {
            title: "Пароль",
            placeholder: "Написать пароль",
            type: "password",
            matchRegexpStr: "^.{6,}$",
            required: true,
          },
        },
      };
    },
    head: { title: "Вход", },
    methods: {
      /**
       * Handles an emit for a user login
       * @param {object} data User data
       */
      login(data) {
        if (Object.keys(data).length !== Object.keys(this.fields).length) {
          alert("Все поля должны быть заполнены");
          return;
        }

        const loginData = Object.keys(data).reduce((acc, key) => {
          acc[key] = data[key].model;

          return acc;
        }, {});

        const res = this.$store.dispatch("auth/login", loginData);

        this.pendingLogin = true;

        res.then(({ ok, message, }) => {
          this.pendingLogin = false;

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