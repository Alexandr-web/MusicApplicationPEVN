<template>
  <div class="profile gaps-t-b">
    <div class="profile__inner">
      <h1 class="profile__singout-title">
        Выход...
      </h1>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SignoutUserPage",
    layout: "default",
    // We erase all data and go to the authorization page
    async mounted() {
      try {
        this.$store.commit("audio/clearAudio");
        this.$store.commit("auth/clearToken");

        await this.$router.push("/auth/login");
      } catch (err) {
        throw err;
      }
    },
  };
</script>