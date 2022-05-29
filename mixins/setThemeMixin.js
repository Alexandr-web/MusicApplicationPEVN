export default {
  mounted() {
    const theme = localStorage.getItem("theme");

    if (theme) {
      document.body.dataset.theme = theme;
    } else {
      localStorage.setItem("theme", "dark");

      document.body.dataset.theme = "dark";
    }
  },
};