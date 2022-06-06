<template>
  <main class="profile__main">
    <div class="container">
      <vProfileSettings v-if="tab === 'settings'" />
      <vProfileArtists
        v-if="tab === 'artists'"
        :user="user"
      />
      <vProfilePlaylists
        v-if="tab === 'playlists'"
        :user="user"
      />
      <vProfileAudio
        v-if="tab === 'audio'"
        :user="user"
      />
    </div>
  </main>
</template>

<script>
  import vProfileSettings from "@/components/profile/vProfileSettings";
  import vProfileArtists from "@/components/profile/vProfileArtists";
  import vProfilePlaylists from "@/components/profile/vProfilePlaylists";
  import vProfileAudio from "@/components/profile/vProfileAudio";

  export default {
    name: "ProfileMainComponent",
    components: {
      vProfileSettings, 
      vProfileArtists,
      vProfilePlaylists,
      vProfileAudio,
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