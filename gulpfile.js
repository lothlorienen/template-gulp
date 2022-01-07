// необходимые пакеты
const { src, dest, task, watch, series, parallel } = require("gulp");
const bs = require("browser-sync");
const conf = require("./config/config.js");
const plumber = require("gulp-plumber");
const gulpRename = require("gulp-rename");
const cheerio = require("gulp-cheerio");

// Задаём режим сборки
const { setMode } = require("./config/mode.js");
const twConfig = require("./tailwind.config.js");

// объявляем глобальную переменную, создавая уникальные интсансы, к которым необходимо обращаться
global.$ = {
  cheerio,
  conf,
  gulp: { src, dest, task, watch, series, parallel },
  gulpRename,
  plumber,
  server: bs.create(),
  task: require("./gulp-tasks/_index.js"),
  twConfig
};

$.task.forEach((taskPath) => require(taskPath)());

// разбиваем задачи на группы
const transpile = $.gulp.parallel("hbs", "styles", "scripts", "assets", "svgSprite", "svgInline");
const setup = ["clean", transpile, "webp"];
const initServer = $.gulp.parallel("serve", "watch");

// export const dev = $.gulp.series(setMode(), $.gulp.series(...setup, 'prepareHtmlDev'), initServer)
// export const build = $.gulp.series(
//   setMode(true),
//   $.gulp.series(...setup, 'prepareHtmlBuild'),
//   $.gulp.parallel('meta', 'imagesOpt'),
// )

// Инициализируем таски

$.gulp.task("dev", (done) => {
  $.gulp.series(setMode(), $.gulp.series(...setup, "prepareHtmlDev"), initServer)(done);
});
$.gulp.task("build", (done) => {
  $.gulp.series(setMode(true), $.gulp.series(...setup, "prepareHtmlBuild"), $.gulp.parallel("meta", "imageMin"))(done);
});

// module.exports.dev = $.gulp.series(
//   setMode(), clean,
//   // $.gulp.parallel('styles',), //'scripts'),
//   // $.gulp.parallel('hbs', 'svg:sprite', 'svg:inline', 'assets'),
//   // $.gulp.parallel('prepareHtmlDev',), //'webp'),
//   $.gulp.parallel(server),
// )
//
// $.gulp.task('build', done => {
//   $.gulp.series('clean',
//     $.gulp.parallel('styles', 'scripts'),
//     $.gulp.parallel('hbs', 'svg:sprite', 'svg:inline', 'assets'),
//     // $.gulp.parallel('imageMin', 'criticalCss'),
//     $.gulp.parallel('prepareHtmlBuild', 'webp'),
//     $.gulp.parallel('meta'),
//   )(done);
// });
//
// $.gulp.task('build-prod', done => {
//   $.gulp.series('clean',
//     $.gulp.parallel('styles', 'scripts'),
//     $.gulp.parallel('hbs-prod', 'svg:sprite', 'svg:inline', 'assets'),
//     $.gulp.parallel('prepareHtmlProd', 'webp'),
//     // $.gulp.parallel('sitemap'),
//     // $.gulp.parallel('imageMin', 'criticalCss'),
//   )(done);
// });
