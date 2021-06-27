const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const gulpPostcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const Fibers = require('fibers')
const shorthand = require('gulp-shorthand')

module.exports = function styles() {
  const isProd = $.conf.cssMin && $.conf.buildMode === 'prod'
  const stylesPath = `${$.conf.source}/${$.conf.styles}`
  const sheets = [`./${stylesPath}/main.scss`, `./${stylesPath}/uikit.scss`]
  const plugins = [autoprefixer({cascade: false}), cssnano()]

  if (isProd) {
    // сокращает стили
    return $.gulp.src(sheets)
      .pipe(sass.sync({
        includePaths: ['./node_modules'],
        fiber: Fibers
      }).on('error', sass.logError))
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
      .pipe($.bs.reload({stream: true}))
  }

  return $.gulp
    .src(sheets)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(sass.sync({
      // importer: require('node-sass-tilde-importer'),
      includePaths: ['./node_modules'],
      fiber: Fibers
    }).on('error', sass.logError))
    .pipe(gulpPostcss(plugins))
    .pipe(cleanCSS({
      debug: true,
      compatibility: '*'
    }, details => {
      console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
    }))
    .pipe($.sourcemaps.write())
    .pipe($.gulpRename({extname: '.min.css'}))
    .pipe($.gulp.dest(`${$.conf.outputPath}/css`))
    .pipe($.bs.reload({stream: true}))
}
