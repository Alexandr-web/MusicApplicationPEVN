export default {
  methods: {
    async getValidAvatarUrl(path) {
      if (/^\/\_nuxt\//.test(path)) {
        return path;
      }

      const url = await require(`@/avatars/${path}`);

      return /^\/\_nuxt\//.test(url) ? url : "";
    },
  },
};