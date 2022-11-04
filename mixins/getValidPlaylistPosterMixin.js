export default {
  methods: {
    /**
     * Converts a path to a valid file path
     * @param {string} path path url
     * @returns {string} valid url file
     */
    async getValidPlaylistPoster(path) {
      if (/^\/\_nuxt\//.test(path)) {
        return path;
      }

      const url = await require(`@/playlistPosters/${path}`);

      return /^\/\_nuxt\//.test(url) ? url : "";
    },
  },
};