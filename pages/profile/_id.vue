<template>
  <div class="profile page">
    <div class="profile__inner">
      <vProfileHeader :user="user" />
      <vProfileMain
        :tab="$route.query.tab"
        :user="user"
      />
    </div>
  </div>
</template>

<script>
  import getValidURLForAvatar from "@/getValidURLForAvatar/index";
  import vProfileHeader from "@/components/profile/vProfileHeader";
  import vProfileMain from "@/components/profile/vProfileMain";

  export default {
    name: "ProfilePage",
    components: { 
      vProfileHeader,
      vProfileMain,
    },
    layout: "default",
    middleware: "checkAuth",
    validate({ params: { id, }, store, query: { tab, }, }) {
      const res = store.dispatch("auth/getUser", id);

      return res.then((data) => {
        this.user = data.user;

        return Boolean(data.user) && ["settings", "audio", "playlists", "artists"].includes(tab);
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