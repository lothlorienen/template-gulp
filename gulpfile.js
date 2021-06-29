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
import {createGulpEsbuild} from 'gulp-esbuild'

// задачи
import {serve, watch} from "./gulp-tasks/serve.js"
import {clean} from "./gulp-tasks/clean.js"
import {styles} from "./gulp-tasks/styles.js"
import {assets} from "./gulp-tasks/assets.js"
import {svgInline, svgSprite} from "./gulp-tasks/svg.js"
import {hbs} from "./gulp-tasks/hbs.js"
import {prepareHtmlDev} from "./gulp-tasks/prepare-html-dev.js"
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
  gulpEsbuild: createGulpEsbuild({incremental: true}),
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
    js,
  },
}

const ready = $.gulp.parallel(
  $.task.hbs,
  $.task.styles,
  $.task.js,
  $.task.assets,
  $.task.svgSprite,
  $.task.svgInline,
)
const build = $.gulp.series($.task.clean, ready, $.task.prepareHtmlDev)
const initServer = $.gulp.parallel($.task.serve, $.task.watch)
// Инициализируем наши таски
export const dev = $.gulp.series(setMode(), build, initServer)


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
