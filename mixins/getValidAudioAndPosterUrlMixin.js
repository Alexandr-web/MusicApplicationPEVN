export default {
  methods: {
    /**
     * Converts a path to a valid file path
     * @param {string} path path url
     * @returns {string} valid url file
     */
    async getValidAudioAndPosterUrl(path) {
      if (/^\/\_nuxt\//.test(path)) {
        return path;
      }

      const url = await require(`@/audio/${path}`);

      if (url.default) {
        return /^\/\_nuxt\//.test(url.default) ? url.default : "";
      }

      return /^\/\_nuxt\//.test(url) ? url : "";
    },
  },
};