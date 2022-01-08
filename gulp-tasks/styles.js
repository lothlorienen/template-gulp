const gulpSass = require('gulp-sass')
const sass = require('sass')
const sourcemaps = require('gulp-sourcemaps')
const gulpPostcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const tilde = require('node-sass-tilde-importer')
const tailwind = require('tailwindcss')
const cleanCSS = require('gulp-clean-css')

const SCSS = gulpSass(sass)

const { logStyles } = require('./_utils.js')

module.exports = () => {
  const sheetsMain = [`./${$.conf.styles}/*.scss`, `!./${$.conf.styles}/uikit.scss`]
  const sheetsUIKit = [`./${$.conf.styles}/uikit.scss`]
  const PostCSSPlugins = [tailwind($.twConfig), autoprefixer({ cascade: false })]

  $.gulp.task('stylesMain', (done) => {
    switch ($.conf.isProd) {
      case true:
        return $.gulp
          .src(sheetsMain)
          .pipe(SCSS.sync({ importer: tilde, includePaths: ['./node_modules'] }).on('error', SCSS.logError))
          .pipe(gulpPostcss([...PostCSSPlugins, cssnano]))
          .pipe(cleanCSS({ debug: true, compatibility: '*' }, (details) => logStyles(details)))
          .pipe($.gulpRename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
          .on('end', done)
      case false:
        return $.gulp
          .src(sheetsMain)
          .pipe($.plumber())
          .pipe(sourcemaps.init())
          .pipe(SCSS.sync({ importer: tilde, includePaths: ['./node_modules'] }).on('error', SCSS.logError))
          .pipe(gulpPostcss([...PostCSSPlugins]))
          .pipe(sourcemaps.write())
          .pipe($.gulpRename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
          .pipe($.server.stream())
          .on('end', done)
    }
  })
  $.gulp.task('stylesUIKit', (done) => {
    switch ($.conf.isProd) {
      case true:
        return $.gulp
          .src(sheetsUIKit)
          .pipe($.plumber())
          .pipe(SCSS.sync({ importer: tilde, includePaths: ['./node_modules'] }).on('error', SCSS.logError))
          .pipe(gulpPostcss([...PostCSSPlugins, cssnano]))
          .pipe(cleanCSS({ debug: true, compatibility: '*' }, (details) => logStyles(details)))
          .pipe($.gulpRename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
          .on('end', done)
      case false:
        return $.gulp
          .src(sheetsUIKit)
          .pipe($.plumber())
          .pipe(sourcemaps.init())
          .pipe(SCSS.sync({ importer: tilde, includePaths: ['./node_modules'] }).on('error', SCSS.logError))
          .pipe(gulpPostcss([...PostCSSPlugins]))
          .pipe(sourcemaps.write())
          .pipe($.gulpRename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
          .pipe($.server.stream())
          .on('end', done)
    }
  })
}
