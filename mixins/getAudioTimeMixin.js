export default {
  methods: {
    getValidTime(duration) {
      const s = Math.floor(parseInt(duration % 60));
      const m = Math.floor(parseInt((duration / 60) % 60));

      return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
    },
  },
};