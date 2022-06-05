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
  import getValidURLForAvatarMixin from "@/mixins/getValidURLForAvatarMixin";
  import vProfileHeader from "@/components/profile/vProfileHeader";
  import vProfileMain from "@/components/profile/vProfileMain";
  import audioControlsMixin from "@/mixins/audioControlsMixin";

  export default {
    name: "ProfilePage",
    components: { 
      vProfileHeader,
      vProfileMain,
    },
    mixins: [getValidURLForAvatarMixin, audioControlsMixin],
    layout: "default",
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
        const user = { ...res.user, avatar: await this.getValidAvatarUrl(res.user.avatar), };

        this.user = user;
      } catch (err) {
        throw err;
      }
    },
  };
</script>