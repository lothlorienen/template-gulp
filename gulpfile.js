'use strict';

global.$ = {
  gulp: require('gulp'),
  sourcemaps: require('gulp-sourcemaps'),
  bs: require('browser-sync').create(),
  fs: require('fs'),
  path: require('path'),
  // tasks: require('./gulp-tasks/_index.js'),
  conf: require('./config/config.json'),
  del: require('del'),
  plumber: require('gulp-plumber'),
  gulpRename: require('gulp-rename'),
  // webp: require('gulp-webp'),
  // glob: require('glob'),
  // merge: require('merge-stream'),
  // argv: require('yargs').argv,
  // webpack: require('webpack'),
  // webpackStream: require('webpack-stream'),
  // webpackTerser: require('terser-webpack-plugin'),
  task: {
    serve: require(`./gulp-tasks/serve`),
    clean: require(`./gulp-tasks/clean`),
    styles: require(`./gulp-tasks/styles`),
  },
};

// Задаём режим сборки
const setMode = (isProduction = false) => {
  return cb => {
    process.env.NODE_ENV = isProduction ? 'production' : 'development'
    $.conf.buildMode = isProduction ? 'prod' : 'dev'
    $.conf.outputPath = isProduction ? $.conf.prod : $.conf.dev
    cb()
  }
}

// const dev = $.gulp.parallel(styles)
const build = $.gulp.series($.task.clean, $.task.styles)

// Инициализируем наши таски
module.exports.dev = $.gulp.series(setMode(), build, $.task.serve)
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
