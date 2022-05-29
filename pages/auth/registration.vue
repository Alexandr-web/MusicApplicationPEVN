<template>
  <vRegistrationForm
    :pending="pendingRegistration"
    @registration="registration"
  />
</template>

<script>
import vRegistrationForm from "@/components/vRegistrationForm";

export default {
  name: "RegistrationPage",
  components: { vRegistrationForm, },
  layout: "auth",
  middleware: "checkAlreadyAuth",
  data() {
    return { pendingRegistration: false, };
  },
  methods: {
    registration(data) {
      if (Object.values(data).every(Boolean) && data.avatar instanceof File) {
        const fd = new FormData();
        
        Object.keys(data).map((key) => fd.append(key, data[key]));

        const res = this.$store.dispatch("auth/registration", fd);

        this.pendingRegistration = true;

        res.then(({ ok, }) => {
          this.pendingRegistration = false;
          
          if (ok) {
            this.$router.push("/auth/login");
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