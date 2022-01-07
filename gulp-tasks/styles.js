const gulpSass = require('gulp-sass')
const sass = require('sass')
const sourcemaps = require('gulp-sourcemaps')
const gulpPostcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const tilde = require('node-sass-tilde-importer')
const tailwind = require('tailwindcss')

const SCSS = gulpSass(sass)

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const round = (source, n) => {
  const places = Math.pow(10, n)
  return Math.round(source * places) / places
}
const log = (details) =>
  console.log(
    `${details.name}: ${formatBytes(details.stats.originalSize)} --> ${formatBytes(
      details.stats.minifiedSize
    )} by ${round(details.stats.efficiency * 100, 3)}%`
  )

module.exports = () => {
  const sheets = [`./${$.conf.styles}/main.css`, `./${$.conf.styles}/styles.scss`, `./${$.conf.styles}/uikit.scss`]
  const PostCSSPlugins = [tailwind($.twConfig), autoprefixer({ cascade: false }), cssnano()]

  $.gulp.task('styles', (done) => {
    switch ($.conf.isProd) {
      case true:
        return $.gulp
          .src(sheets)
          .pipe($.plumber())
          .pipe(
            SCSS.sync({
              importer: tilde,
              includePaths: ['./node_modules'],
              // fiber: Fibers,
            }).on('error', SCSS.logError)
          )
          .pipe(gulpPostcss(PostCSSPlugins))
          .pipe($.gulpRename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
      case false:
        return $.gulp
          .src(sheets)
          .pipe($.plumber())
          .pipe(sourcemaps.init())
          .pipe(
            SCSS.sync({
              importer: tilde,
              includePaths: ['./node_modules'],
            }).on('error', SCSS.logError)
          )
          .pipe(gulpPostcss(PostCSSPlugins))
          .pipe(sourcemaps.write())
          .pipe($.gulpRename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
          .pipe($.server.stream())
    }
    done()
  })
}
