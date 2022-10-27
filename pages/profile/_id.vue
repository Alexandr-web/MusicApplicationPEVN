<template>
  <div class="profile gaps-t-b">
    <div class="profile__inner">
      <vProfileHeader :user="user" />
      <vProfileMain :tab="$route.query.tab" />
    </div>
  </div>
</template>

<script>
  import vProfileHeader from "@/components/profile/vProfileHeader";
  import vProfileMain from "@/components/profile/vProfileMain";
  import getValidUrlForAvatarMixin from "@/mixins/getValidUrlForAvatarMixin";

  export default {
    name: "ProfilePage",
    components: { 
      vProfileHeader,
      vProfileMain,
    },
    mixins: [getValidUrlForAvatarMixin],
    layout: "default",
    validate({ params: { id, }, store, query: { tab, }, }) {
      const res = store.dispatch("profile/getOne", id);

      return res.then(({ ok, user, }) => {
        if (!(ok || user)) {
          return false;
        }

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
        const { ok, user, } = await this.$store.dispatch("profile/getOne", id);

        if (ok) {
          const avatar = await this.getValidAvatarUrl(user.avatar);

          this.user = {
            ...user,
            avatar,
          };
        }
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Профиль", },
  };
</script>