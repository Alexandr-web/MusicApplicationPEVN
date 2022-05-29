<template>
  <div class="profile page">
    <code>
      {{ user }}
    </code>
  </div>
</template>

<script>
  import getValidURLForAvatar from "@/getValidURLForAvatar/index";

  export default {
    name: "ProfilePage",
    layout: "default",
    middleware: "checkAuth",
    validate({ params: { id, }, store, }) {
      const res = store.dispatch("auth/getUser", id);

      return res.then((data) => {
        this.user = data.user;

        return Boolean(data.user);
      }).catch((err) => {
        throw err;
      });
    },
    data() {
      return { user: {}, };
    },
    async fetch() {
      try {
        const { id, } = this.$route.params;
        const res = await this.$store.dispatch("auth/getUser", id);
        const user = { ...res.user, avatar: await getValidURLForAvatar(res.user.avatar), };

        this.user = user;
      } catch (err) {
        throw err;
      }
    },
  };
</script>