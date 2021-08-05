// необходимые пакеты
import gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import bs from 'browser-sync'
import fs from 'fs'
import path from 'path'
import conf from './config/config.js'
import del from 'del'
import plumber from 'gulp-plumber'
import gulpRename from 'gulp-rename'
import gulpReplace from 'gulp-replace'
import gulpCompileHandlebars from 'gulp-compile-handlebars'
import htmlMin from 'gulp-htmlmin'
import cheerio from 'gulp-cheerio'

// задачи
import {serve, watch} from "./gulp-tasks/serve.js"
import {clean} from "./gulp-tasks/clean.js"
import {styles} from "./gulp-tasks/styles.js"
import {assets} from "./gulp-tasks/assets.js"
import {svgInline, svgSprite} from "./gulp-tasks/svg.js"
import {hbs} from "./gulp-tasks/hbs.js"
import {prepareHtmlDev} from "./gulp-tasks/prepare-html-dev.js"
import {prepareHtmlBuild} from "./gulp-tasks/prepare-html-build.js";
import {js} from "./gulp-tasks/scripts.js"

// Задаём режим сборки
import {setMode} from "./config/mode.js"

// db
import data from './src/app/db/db.js'
import links from './src/app/db/links.js'

global.$ = {
  gulp,
  sourcemaps,
  server: bs.create(),
  watch,
  fs,
  path,
  conf,
  del,
  plumber,
  gulpRename,
  gulpReplace,
  gulpCompileHandlebars,
  htmlMin,
  cheerio,
  hbsDB: {...data, ...links},
  task: {
    serve,
    watch,
    clean,
    styles,
    assets,
    svgSprite,
    svgInline,
    hbs,
    prepareHtmlDev,
    prepareHtmlBuild,
    js,
  },
}

const transpile = $.gulp.parallel(hbs, styles, js, assets, svgSprite, svgInline)
const setup = [clean, transpile]
const initServer = $.gulp.parallel(serve, watch)
// Инициализируем наши таски
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
