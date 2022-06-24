<template>
  <div class="profile gaps-t-b">
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

  export default {
    name: "ProfilePage",
    components: { 
      vProfileHeader,
      vProfileMain,
    },
    mixins: [getValidURLForAvatarMixin],
    layout: "default",
    validate({ params: { id, }, store, query: { tab, }, }) {
      const res = store.dispatch("auth/getUser", id);

      return res.then(({ ok, user, }) => {
        if (!ok) {
          return false;
        }

        this.user = user;

        return Boolean(user) && ["settings", "audio", "playlists", "favorite"].includes(tab);
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
    head: { title: "Профиль", },
  };
</script>