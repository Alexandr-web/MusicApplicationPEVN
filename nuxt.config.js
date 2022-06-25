export default {
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

  css: [
    "@/static/css/main.css"
  ],

  plugins: [
    { src: "~/plugins/vue-awesome-swiper.js", ssr: false, },
    { src: "~/plugins/validation.js", }
  ],

  components: true,

  buildModules: [
  ],

  modules: [
  ],

  serverMiddleware: [
    "@/server/app.js"
  ],

  build: {
    extend(config) {
      const audioFileRule = {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: "file-loader",
        options: { name: "[path][name].[ext]", },
      };

      config.module.rules.push(audioFileRule);
    },
  },
};
