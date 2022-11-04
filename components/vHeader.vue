<template>
  <header class="header">
    <nav class="header__nav">
      <div class="header__user">
        <nuxt-link
          class="header__user-link"
          :to="`/profile/${getUser.id}?tab=settings`"
          :title="getUser.name"
        >
          <div class="header__user-avatar">
            <img
              class="header__user-avatar-image"
              :src="getUser.avatar"
            >
          </div>
          <h4 class="header__user-name">
            {{ getUser.name }}
          </h4>
        </nuxt-link>
      </div>
    </nav>
  </header>
</template>

<script>
  export default {
    name: "HeaderComponent",
    computed: {
      getUser() {
        return this.$store.getters["profile/getUser"];
      },
    },
  };
</script>
