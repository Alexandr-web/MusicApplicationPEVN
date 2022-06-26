<template>
  <header class="header">
    <nav class="header__nav">
      <ul class="header__list">
        <li class="header__list-item">
          <div class="header__list-search">
            <input
              v-model.trim="search"
              class="header__list-search-input"
              type="text"
              placeholder="Искать"
            >
          </div>
        </li>
        <li class="header__list-item">
          <nuxt-link
            class="header__list-user"
            :to="`/profile/${user.id}?tab=settings`"
            :title="user.name"
          >
            <div class="header__list-avatar">
              <img
                class="header__list-avatar-image"
                :src="user.avatar"
              >
            </div>
            <h4 class="header__list-username">
              {{ user.name }}
            </h4>
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
  import getValidURLForAvatarMixin from "@/mixins/getValidURLForAvatarMixin";

  export default {
    name: "HeaderComponent",
    mixins: [getValidURLForAvatarMixin],
    data() {
      return {
        search: "",
        user: {},
      };
    },
    async fetch() {
      try {
        const { ok, user, } = await this.$store.dispatch("auth/getUser");

        if (ok) {
          this.user = { ...user, avatar: await this.getValidAvatarUrl(user.avatar), };
        }
      } catch (err) {
        throw err;
      }
    },
  };
</script>
