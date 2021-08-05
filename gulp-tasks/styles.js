import gulpSass from 'gulp-sass'
import sass from 'sass'
import cleanCSS from 'gulp-clean-css'
import sourcemaps from 'gulp-sourcemaps'
import gulpPostcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import Fibers from 'fibers'
import shorthand from 'gulp-shorthand'
import tilde from 'node-sass-tilde-importer'

const SCSS = gulpSass(sass)

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const styles = () => {
  const sheets = [
    `./${$.conf.styles}/main.scss`,
    `./${$.conf.styles}/uikit.scss`,
  ]
  const plugins = [autoprefixer({ cascade: false }), cssnano()]
  const log = (details) =>
    console.log(
      `${details.name}: ${formatBytes(
        details.stats.originalSize
      )} --> ${formatBytes(details.stats.minifiedSize)} by ${
        Math.round((details.stats.efficiency + Number.EPSILON) * 1000) / 10
      }%`
    )

  switch ($.conf.isProd) {
    case true:
      console.log('mode: ', $.conf.isProd)
      return $.gulp
        .src(sheets)
        .pipe($.plumber())
        .pipe(
          SCSS.sync({
            importer: tilde,
            includePaths: ['./node_modules'],
            fiber: Fibers,
          }).on('error', SCSS.logError)
        )
        .pipe(gulpPostcss(plugins))
        .pipe(shorthand())
        .pipe(
          cleanCSS(
            {
              level: {
                1: {
                  all: true,
                  normalizeUrls: false,
                },
                2: {
                  all: true,
                  removeUnusedAtRules: false,
                },
              },
              debug: true,
            },
            (details) => log(details)
          )
        )
        .pipe($.gulpRename({ extname: '.min.css' }))
        .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
    // .pipe($.server.stream())
    case false:
      console.log('not build')
      return $.gulp
        .src(sheets)
        .pipe($.plumber())
        .pipe(sourcemaps.init())
        .pipe(
          SCSS.sync({
            importer: tilde,
            includePaths: ['./node_modules'],
            fiber: Fibers,
          }).on('error', SCSS.logError)
        )
        .pipe(gulpPostcss(plugins))
        .pipe(
          cleanCSS(
            {
              debug: true,
              compatibility: '*',
            },
            (details) => log(details)
          )
        )
        .pipe(sourcemaps.write())
        .pipe($.gulpRename({ extname: '.min.css' }))
        .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
        .pipe($.server.stream())
  }
}
