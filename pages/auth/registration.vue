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
  data() {
    return { pendingRegistration: false, };
  },
  head: { title: "Регистрация", },
  methods: {
    /**
     * Handles an emit for user registration
     * @param {object} data User data
     */
    registration(data) {
      if (Object.values(data).every(Boolean) && data.avatar instanceof File) {
        const fd = new FormData();
        
        Object.keys(data).map((key) => fd.append(key, data[key]));

        const res = this.$store.dispatch("auth/registration", fd);

        this.pendingRegistration = true;

        res.then(({ ok, message, }) => {
          this.pendingRegistration = false;
          
          alert(message);

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