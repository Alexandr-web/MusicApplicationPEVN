export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Music Application",
    htmlAttrs: { lang: "ru", },
    meta: [
      { charset: "utf-8", },
      { name: "viewport", content: "width=device-width, initial-scale=1", },
      { hid: "description", name: "description", content: "", },
      { name: "format-detection", content: "telephone=no", }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico", }
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@/static/css/main.css"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/vuelidate.js"
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  serverMiddleware: [
    "@/server/app.js"
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: "file-loader",
        options: { name: "[path][name].[ext]", },
      });
    },
  },
};
