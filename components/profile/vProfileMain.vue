<template>
  <main class="profile__main">
    <div class="container">
      <vProfileSettings v-if="tab === 'settings'" />
      <vProfileArtists
        v-if="tab === 'artists'"
        :user="user"
      />
    </div>
  </main>
</template>

<script>
  import vProfileSettings from "@/components/profile/vProfileSettings";
  import vProfileArtists from "@/components/profile/vProfileArtists";

  export default {
    name: "ProfileMainComponent",
    components: {
      vProfileSettings, 
      vProfileArtists,
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