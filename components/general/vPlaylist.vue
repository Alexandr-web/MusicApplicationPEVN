<template>
  <li
    class="playlists__item"
    @click="$emit('setPlaylist', playlist)"
  >
    <div class="playlists__item-poster">
      <img
        class="playlists__item-poster-image"
        :src="playlist.poster"
        :alt="playlist.name"
      >
    </div>
    <h3 class="playlists__item-name">
      {{ playlist.name }}
    </h3>
  </li>
</template>

<script>
  export default {
    name: "PlaylistComponent",
    props: {
      playlist: {
        type: Object,
        required: true,
      },
    },
  };
</script>