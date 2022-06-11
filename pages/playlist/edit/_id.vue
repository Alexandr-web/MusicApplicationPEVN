<template>
  <div class="page playlist">
    <div class="container">
      <div class="playlist__inner"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "EditPlaylistPage",
    layout: "default",
    validate({ params: { id: playlistId, }, store, }) {
      const token = store.getters["auth/getToken"];
      const res = store.dispatch("playlist/getOne", { token, playlistId, });

      return res.then(({ ok, playlist, }) => ok && Boolean(playlist)).catch((err) => {
        throw err;
      });
    },
  };
</script>