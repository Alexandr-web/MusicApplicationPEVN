<template>
  <header class="header">
    <nav class="header__nav">
      <div class="header__user">
        <nuxt-link
          class="header__user-link"
          :to="`/profile/${user.id}?tab=settings`"
          :title="user.name"
        >
          <div class="header__user-avatar">
            <img
              class="header__user-avatar-image"
              :src="user.avatar"
            >
          </div>
          <h4 class="header__user-name">
            {{ user.name }}
          </h4>
        </nuxt-link>
      </div>
    </nav>
  </header>
</template>

<script>
  import getValidURLForAvatarMixin from "@/mixins/getValidURLForAvatarMixin";

  export default {
    name: "HeaderComponent",
    mixins: [getValidURLForAvatarMixin],
    data() {
      return { user: {}, };
    },
    async fetch() {
      try {
        const { ok, user, } = await this.$store.dispatch("profile/getOne");

        if (ok) {
          this.user = { ...user, avatar: await this.getValidAvatarUrl(user.avatar), };
        }
      } catch (err) {
        throw err;
      }
    },
  };
</script>
