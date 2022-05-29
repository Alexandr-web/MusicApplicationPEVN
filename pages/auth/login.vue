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
  middleware: "checkAlreadyAuth",
  data() {
    return { pendingLogin: false, };
  },
  methods: {
    login(data) {
      if (Object.values(data).every(Boolean)) {
        const res = this.$store.dispatch("auth/login", data);

        this.pendingLogin = true;

        res.then(({ ok, }) => {
          this.pendingLogin = false;

          if (ok) {
            this.$router.push("/");
          }
        }).catch((err) => {
          throw err;
        });
      } else {
        alert("Все поля должны быть заполнены!");
      }
    },
  },
};
</script>