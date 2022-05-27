const { dest, parallel, watch, src, } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const cleanCss = require("gulp-clean-css");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");

const paths = {
  scss: {
    from: ["./static/scss/*.scss", "!./static/scss/_*.scss"],
    to: "./static/css/",
  },
};

const styles = () => {
  const res = src(paths.scss.from)
    .pipe(plumber())
    .pipe(scss({ outputStyle: "expanded", }))
    .pipe(autoprefixer({ cascade: true, overrideBrowserslist: ["last 5 versions"], }))
    .pipe(cleanCss({ level: { 1: { specialComments: 0, }, }, }))
    .pipe(concat("main.css"))
    .pipe(dest(paths.scss.to));

  return res;
};

const watching = () => {
  watch(paths.scss.from, parallel(styles));
};

const buildFunc = () => parallel(styles);
const defaultFunc = () => parallel(buildFunc(), watching);

exports.build = buildFunc();
exports.default = defaultFunc();