<template>
  <vLoginForm
    :pending="pendingLogin"
    @login="login"
  />
</template>

<script>
  import vLoginForm from "@/components/vLoginForm";

  export default {
    name: "LoginPage",
    components: { vLoginForm, },
    layout: "auth",
    data() {
      return { pendingLogin: false, };
    },
    head: { title: "Вход", },
    methods: {
      /**
       * Handles an emit for a user login
       * @param {object} data User data
       */
      login(data) {
        const res = this.$store.dispatch("auth/login", data);

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