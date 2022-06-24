<template>
  <main class="profile__main">
    <div class="container">
      <vProfileSettings v-if="tab === 'settings'" />
      <vProfileAudio v-if="tab === 'audio'" />
      <vProfileFavorite v-if="tab === 'favorite'" />
      <vProfilePlaylists v-if="tab === 'playlists'" />
    </div>
  </main>
</template>

<script>
  import vProfileSettings from "@/components/profile/vProfileSettings";
  import vProfilePlaylists from "@/components/profile/vProfilePlaylists";
  import vProfileAudio from "@/components/profile/vProfileAudio";
  import vProfileFavorite from "@/components/profile/vProfileFavorite";

  export default {
    name: "ProfileMainComponent",
    components: {
      vProfileSettings,
      vProfilePlaylists,
      vProfileAudio,
      vProfileFavorite,
    },
    props: {
      tab: {
        type: String,
        required: true,
      },
      user: {
        type: Object,
        required: true,
      },
    },
  };
</script>