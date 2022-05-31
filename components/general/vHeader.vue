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
  import getValidURLForAvatar from "@/getValidURLForAvatar/index";

  export default {
    name: "HeaderComponent",
    data() {
      return {
        search: "",
        user: {},
      };
    },
    async fetch() {
      try {
        const res = await this.$store.dispatch("auth/getUser");
        const user = { ...res.user, avatar: await getValidURLForAvatar(res.user.avatar), };
        
        this.user = user;
      } catch (err) {
        throw err;
      }
    },
  };
</script>