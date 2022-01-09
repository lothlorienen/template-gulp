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
  const sheetsMain = [`${$.config.path.src.styles}/*.scss`, `!${$.config.path.src.styles}/uikit.scss`]
  const sheetsUIKit = [`${$.config.path.src.styles}/uikit.scss`]
  const PostcssPlugins = [tailwind($.config.tailwind.stylesMain), autoprefixer({ cascade: false })]
  const PostcssPluginsUIKit = [tailwind($.config.tailwind.stylesUIKit), autoprefixer({ cascade: false })]

  $.gulp.task('stylesMain', (done) => {
    switch ($.config.isProd) {
      case true:
        return $.gulp
          .src(sheetsMain)
          .pipe(SCSS.sync({ importer: tilde, includePaths: ['./node_modules'] }).on('error', SCSS.logError))
          .pipe(gulpPostcss([...PostcssPlugins, cssnano]))
          .pipe(cleanCSS({ debug: true, compatibility: '*' }, (details) => logStyles(details)))
          .pipe($.gulpRename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.config.path.output.base}/css`))
          .on('end', done)
      case false:
        return $.gulp
          .src(sheetsMain)
          .pipe($.plumber())
          .pipe(sourcemaps.init())
          .pipe(SCSS.sync({ importer: tilde, includePaths: ['./node_modules'] }).on('error', SCSS.logError))
          .pipe(gulpPostcss([...PostcssPlugins]))
          .pipe(sourcemaps.write())
          .pipe($.gulpRename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.config.path.output.base}/css`))
          .pipe($.server.stream())
          .on('end', done)
    }
  })
  $.gulp.task('stylesUIKit', (done) => {
    switch ($.config.isProd) {
      case true:
        return $.gulp
          .src(sheetsUIKit)
          .pipe($.plumber())
          .pipe(SCSS.sync({ importer: tilde, includePaths: ['./node_modules'] }).on('error', SCSS.logError))
          .pipe(gulpPostcss([...PostcssPluginsUIKit, cssnano]))
          .pipe(cleanCSS({ debug: true, compatibility: '*' }, (details) => logStyles(details)))
          .pipe($.gulpRename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.config.path.output.base}/css`))
          .on('end', done)
      case false:
        return $.gulp
          .src(sheetsUIKit)
          .pipe($.plumber())
          .pipe(sourcemaps.init())
          .pipe(SCSS.sync({ importer: tilde, includePaths: ['./node_modules'] }).on('error', SCSS.logError))
          .pipe(gulpPostcss([...PostcssPluginsUIKit]))
          .pipe(sourcemaps.write())
          .pipe($.gulpRename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.config.path.output.base}/css`))
          .pipe($.server.stream())
          .on('end', done)
    }
  })
}
