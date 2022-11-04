<template>
  <div class="profile gaps-t-b">
    <div class="profile__inner">
      <vProfileHeader :user="user" />
      <vProfileMain :tab="$route.query.tab" />
    </div>
  </div>
</template>

<script>
  import vProfileHeader from "@/components/vProfileHeader";
  import vProfileMain from "@/components/vProfileMain";
  import getValidUrlForAvatarMixin from "@/mixins/getValidUrlForAvatarMixin";

  export default {
    name: "ProfilePage",
    components: { 
      vProfileHeader,
      vProfileMain,
    },
    mixins: [getValidUrlForAvatarMixin],
    layout: "default",
    // Checking if the user exists
    validate({ params: { id, }, store, query: { tab, }, }) {
      const res = store.dispatch("profile/getOne", id);

      return res.then(({ ok, user, }) => {
        return [ok, user, ["settings", "audio", "playlists", "favorite"].includes(tab)].every(Boolean);
      }).catch((err) => {
        throw err;
      });
    },
    data() {
      return { user: {}, };
    },
    // Get user by id
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