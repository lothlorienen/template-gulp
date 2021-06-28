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

// задачи
import {serve} from "./gulp-tasks/serve.js"
import {clean} from "./gulp-tasks/clean.js"
import {styles} from "./gulp-tasks/styles.js"
import {assets} from "./gulp-tasks/assets.js"
import {svgInline, svgSprite} from "./gulp-tasks/svg.js"

// Задаём режим сборки
import {setMode} from "./gulp-tasks/mode.js"

global.$ = {
  gulp,
  sourcemaps,
  bs: bs.create(),
  fs,
  path,
  conf,
  del,
  plumber,
  gulpRename,
  gulpReplace,
  task: {
    serve,
    clean,
    styles,
    assets,
    svgSprite,
    svgInline,
  },
}


const prepareAssets = $.gulp.parallel($.task.assets, $.task.svgSprite, $.task.svgInline)
const base = $.gulp.parallel($.task.styles, prepareAssets)
const build = $.gulp.series($.task.clean, base)

// Инициализируем наши таски
export const dev = $.gulp.series(setMode(), build, $.task.serve)
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
