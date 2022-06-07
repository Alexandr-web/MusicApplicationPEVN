export default {
  methods: {
    async getValidPlaylistPoster(path) {
      if (/^\/\_nuxt\//.test(path)) {
        return path;
      }

      const url = await require(`@/playlistPosters/${path}`);

      return /^\/\_nuxt\//.test(url) ? url : "";
    },
  },
};