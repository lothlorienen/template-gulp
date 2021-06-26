'use strict';

global.$ = {
  gulp: require('gulp'),
  gulpPlugin: require('gulp-load-plugins')(),
  bs: require('browser-sync'),
  fs: require('fs'),
  path: require('path'),
  tasks: require('./gulp-tasks/_index.js'),
  config: require('./config/config.json')
  // cleanCSS: require('gulp-clean-css'),
  // sass: require('gulp-sass'),
  // rename: require('gulp-rename'),
  // webp: require('gulp-webp'),
  // glob: require('glob'),
  // del: require('del'),
  // merge: require('merge-stream'),
  // argv: require('yargs').argv,
  // tildeImporter: require('node-sass-tilde-importer'),
  // webpack: require('webpack'),
  // webpackStream: require('webpack-stream'),
  // webpackTerser: require('terser-webpack-plugin'),
};
// Выявляем режим сборки и устанавливаем пути
$.config.buildMode = process.env.NODE_ENV === "development" ? 'dev' : 'prod';
$.config.outputPath = $.config.buildMode === 'prod' ? $.config.prodOutput : $.config.devOutput;
// Инициализируем наши таски
$.tasks.forEach((taskPath) => require(taskPath)());

$.gulp.task('dev', done => {
  console.log('gulp worked')
  done()
  // $.gulp.series('clean',
  //   $.gulp.parallel('styles', 'scripts'),
  //   $.gulp.parallel('hbs', 'svg:sprite', 'svg:inline', 'assets'),
  //   $.gulp.parallel('prepareHtmlDev', 'webp'),
  //   $.gulp.parallel('watch', 'serve'),
  // )(done);
});
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
