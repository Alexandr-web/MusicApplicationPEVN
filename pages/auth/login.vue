<template>
  <vLoginForm
    :pending="pendingLogin"
    @login="login"
  />
</template>

<script>
  import vLoginForm from "@/components/auth/vLoginForm";

  export default {
    name: "LoginPage",
    components: { vLoginForm, },
    layout: "auth",
    data() {
      return { pendingLogin: false, };
    },
    head: { title: "Вход", },
    methods: {
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