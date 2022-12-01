<template>
  <div class="profile gaps-t-b">
    <div class="profile__inner">
      <vProfileHeader :user="user" />
      <vProfileMain />
    </div>
  </div>
</template>

<script>
  import vProfileHeader from "@/components/vProfileHeader";
  import vProfileMain from "@/components/vProfileMain";

  export default {
    name: "ProfilePage",
    components: { 
      vProfileHeader,
      vProfileMain,
    },
    layout: "default",
    // Checking if the user exists
    validate({ params: { id, }, store, query: { tab, }, }) {
      if (!id || isNaN(+id)) {
        return false;
      }

      const res = store.dispatch("profile/getOne", id);
      const currentUser = store.getters["profile/getUser"];

      return res.then(({ ok, user, }) => {
        const isGuest = (user || {}).id !== currentUser.id;

        return [ok, user, !isGuest, ["settings", "audio", "playlists", "favorite"].includes(tab)].every(Boolean);
      }).catch((err) => {
        throw err;
      });
    },
    // Get user by id
    async asyncData({ store, params: { id, }, }) {
      try {
        const { ok, user, } = await store.dispatch("profile/getOne", id);

        if (!ok) {
          return { user: {}, };
        }

        const avatar = await store.dispatch("profile/getValidAvatarUrl", user.avatar);

        return {
          user: {
            ...user,
            avatar,
          },
        };
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Профиль", },
  };
</script>