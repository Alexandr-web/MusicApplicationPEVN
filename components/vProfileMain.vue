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
    props: {
      tab: {
        type: String,
        required: true,
      },
    },
  };
</script>