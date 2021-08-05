// необходимые пакеты
import gulp from 'gulp'
import bs from 'browser-sync'
import conf from './config/config.js'
import plumber from 'gulp-plumber'
import gulpRename from 'gulp-rename'
import cheerio from 'gulp-cheerio'

// задачи
import {
  assets,
  clean,
  hbs, js,
  prepareHtmlBuild,
  prepareHtmlDev,
  serve,
  styles,
  svgInline,
  svgSprite,
  watch
} from "./gulp-tasks/index.js";

// Задаём режим сборки
import {setMode} from "./config/mode.js"

// db
import data from './src/app/db/db.js'
import links from './src/app/db/links.js'

// объявляем глобальную переменную, в которой создаем уникальные интсансы, к которым необходимо обращаться
global.$ = {
  gulp,
  server: bs.create(),
  conf,
  plumber,
  gulpRename,
  cheerio,
  hbsDB: {...data, ...links},
  task: { serve, watch, clean, styles, assets, svgSprite, svgInline, hbs, prepareHtmlDev, prepareHtmlBuild, js },
}

// разбиваем задачи на группы
const transpile = $.gulp.parallel(hbs, styles, js, assets, svgSprite, svgInline)
const setup = [clean, transpile]
const initServer = $.gulp.parallel(serve, watch)
// Инициализируем таски
export const dev = $.gulp.series(setMode(), $.gulp.series(...setup, prepareHtmlDev), initServer)
export const build = $.gulp.series(setMode(true), $.gulp.series(...setup, prepareHtmlBuild))


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
