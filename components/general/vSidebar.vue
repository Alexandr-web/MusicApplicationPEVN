<template>
  <aside class="sidebar">
    <nav class="sidebar__nav">
      <ul
        v-if="userId"
        class="sidebar__list"
      >
        <li class="sidebar__list-item">
          <nuxt-link
            class="sidebar__list-link"
            to="/"
            exact-active-class="sidebar__list-link--active"
          >
            <vHomeIcon :class-names="['sidebar__list-icon']" />
            <h4 class="sidebar__list-title">
              Главная
            </h4>
          </nuxt-link>
        </li>
        <li class="sidebar__list-item">
          <nuxt-link
            class="sidebar__list-link"
            :to="`/profile/${userId}?tab=audio`"
            exact-active-class="sidebar__list-link--active"
          >
            <vAudioIcon :class-names="['sidebar__list-icon']" />
            <h4 class="sidebar__list-title">
              Песни
            </h4>
          </nuxt-link>
        </li>
        <li class="sidebar__list-item">
          <nuxt-link
            class="sidebar__list-link"
            :to="`/profile/${userId}?tab=playlists`"
            exact-active-class="sidebar__list-link--active"
          >
            <vPlaylistIcon :class-names="['sidebar__list-icon']" />
            <h4 class="sidebar__list-title">
              Плейлисты
            </h4>
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
  import vAudioIcon from "@/components/icons/vAudioIcon";
  import vHomeIcon from "@/components/icons/vHomeIcon";
  import vPlaylistIcon from "@/components/icons/vPlaylistIcon";

  export default { 
    name: "SidebarComponent",
    components: {
      vAudioIcon,
      vHomeIcon,
      vPlaylistIcon,
    },
    data() {
      return { userId: null, };
    },
    async fetch() {
      try {
        const { ok, user, } = await this.$store.dispatch("auth/getUser");
        
        if (ok) {
          this.userId = user.id;
        }
      } catch (err) {
        throw err;
      }
    },
  };
</script>