import gulpSass from 'gulp-sass'
import sass from 'sass'
const SCSS = gulpSass(sass)
import cleanCSS from 'gulp-clean-css'
import gulpPostcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import Fibers from 'fibers'
import shorthand from 'gulp-shorthand'

export const styles = () => {
  const isProd = $.conf.cssMin && $.conf.buildMode === 'prod'
  const sheets = [`./${$.conf.styles}/main.scss`, `./${$.conf.styles}/uikit.scss`]
  const plugins = [autoprefixer({cascade: false}), cssnano()]

  if (isProd) {
    // сокращает стили
    return $.gulp
      .src(sheets)
      .pipe(SCSS.sync({
        includePaths: ['./node_modules'],
        fiber: Fibers
      }).on('error', SCSS.logError))
      .pipe(gulpPostcss(plugins))
      .pipe(shorthand())
      .pipe(cleanCSS({
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
      }, (details) => console.log(`${details.name}: ${details.stats.originalSize}`
        + '—' + `${details.name}: ${details.stats.minifiedSize}`)))
      .pipe($.gulpRename({extname: '.min.css'}))
      .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
      .pipe($.server.stream())
  }

  return $.gulp
    .src(sheets)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(SCSS.sync({
      // importer: require('node-sass-tilde-importer'),
      includePaths: ['./node_modules'],
      fiber: Fibers
    }).on('error', SCSS.logError))
    .pipe(gulpPostcss(plugins))
    .pipe(cleanCSS({
      debug: true,
      compatibility: '*'
    }, details => console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)))
    .pipe($.sourcemaps.write())
    .pipe($.gulpRename({extname: '.min.css'}))
    .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
    .pipe($.server.stream())
}
