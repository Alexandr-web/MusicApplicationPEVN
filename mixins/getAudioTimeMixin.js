export default {
  methods: {
    /**
     * Converts a time duration to a valid format 00:00
     * @param {number} duration Length of time
     * @returns {string} Valid time format
     */
    getValidTime(duration) {
      const s = Math.floor(parseInt(duration % 60));
      const m = Math.floor(parseInt((duration / 60) % 60));

      return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
    },
  },
};