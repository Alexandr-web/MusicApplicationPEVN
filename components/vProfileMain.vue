<template>
  <main class="profile__main">
    <div class="container">
      <vProfileSettings v-if="tab === 'settings'" />
    </div>
  </main>
</template>

<script>
  import vProfileSettings from "@/components/vProfileSettings";

  export default {
    name: "ProfileMainComponent",
    cmponents: { vProfileSettings, },
    props: {
      tab: {
        type: String,
        required: true,
      },
    },
  };
</script>