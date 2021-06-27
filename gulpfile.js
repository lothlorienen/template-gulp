'use strict';

global.$ = {
  gulp: require('gulp'),
  gulpPlugin: require('gulp-load-plugins')(),
  bs: require('browser-sync').create(),
  fs: require('fs'),
  path: require('path'),
  tasks: require('./gulp-tasks/_index.js'),
  conf: require('./config/config.json'),
  del: require('del'),
  // cleanCSS: require('gulp-clean-css'),
  sass: require('gulp-sass'),
  // rename: require('gulp-rename'),
  // webp: require('gulp-webp'),
  // glob: require('glob'),
  // merge: require('merge-stream'),
  // argv: require('yargs').argv,
  // tildeImporter: require('node-sass-tilde-importer'),
  // webpack: require('webpack'),
  // webpackStream: require('webpack-stream'),
  // webpackTerser: require('terser-webpack-plugin'),
};
// Выявляем режим сборки и устанавливаем пути



const setMode = (isProduction = false) => {
  return cb => {
    process.env.NODE_ENV = isProduction ? 'production' : 'development'
    $.conf.buildMode = isProduction ? 'prod' : 'dev'
    $.conf.outputPath = isProduction ? $.conf.prod : $.conf.dev
    cb()
  }
}

// Инициализируем наши таски
$.tasks.forEach((taskPath) => require(taskPath)());
module.exports.dev = $.gulp.series(setMode(), 'clean',
  $.gulp.parallel('styles',), //'scripts'),
  $.gulp.parallel('hbs', 'svg:sprite', 'svg:inline', 'assets'),
  $.gulp.parallel('prepareHtmlDev',), //'webp'),
  $.gulp.parallel('watch', 'serve'),
)
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
