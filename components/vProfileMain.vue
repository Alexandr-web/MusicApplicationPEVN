<template>
  <main class="profile__main">
    <div class="container">
      <vProfileSettings v-if="$route.query.tab === 'settings'" />
      <vProfileAudio v-if="$route.query.tab === 'audio'" />
      <vProfileFavorite v-if="$route.query.tab === 'favorite'" />
      <vProfilePlaylists v-if="$route.query.tab === 'playlists'" />
    </div>
  </main>
</template>

<script>
  import vProfileSettings from "@/components/vProfileSettings";
  import vProfilePlaylists from "@/components/vProfilePlaylists";
  import vProfileAudio from "@/components/vProfileAudio";
  import vProfileFavorite from "@/components/vProfileFavorite";

  export default {
    name: "ProfileMainComponent",
    components: {
      vProfileSettings,
      vProfilePlaylists,
      vProfileAudio,
      vProfileFavorite,
    },
  };
</script>