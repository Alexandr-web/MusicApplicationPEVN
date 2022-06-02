export default {
  methods: {
    async getValidAudioAndPosterUrl(path) {
      if (/^\/\_nuxt\//.test(path)) {
        return path;
      }

      const url = await require(`@/audio/${path}`);

      return /^\/\_nuxt\//.test(url) ? url : "";
    },
  },
};