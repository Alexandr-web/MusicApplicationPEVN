export default {
  methods: {
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