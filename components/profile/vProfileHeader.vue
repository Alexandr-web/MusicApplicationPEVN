<template>
  <header class="profile__header">
    <div class="container">
      <div class="profile__header-inner">
        <div class="profile__header-info">
          <img
            class="profile__header-avatar"
            :src="user.avatar"
            :alt="user.name"
          >
          <h2 class="profile__header-username">
            {{ user.name }}
          </h2>
        </div>
        <nav class="profile__header-nav">
          <ul class="profile__header-list">
            <li
              v-for="(item, index) in list"
              :key="index"
              class="profile__header-list-item"
            >
              <nuxt-link
                class="profile__header-list-link"
                :to="item.link"
                exact-active-class="profile__header-list-link--active"
              >
                {{ item.name }}
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
  export default { 
    name: "ProfileHeaderComponent",
    props: {
      user: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        list: [
          {
            name: "Настройки",
            link: "?tab=settings",
          },
          {
            name: "Плейлисты",
            link: "?tab=playlists",
          },
          {
            name: "Песни",
            link: "?tab=audio",
          },
          {
            name: "Избранное",
            link: "?tab=favorite",
          }
        ],
      };
    },
  };
</script>