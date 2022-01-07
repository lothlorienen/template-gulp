const imagemin = require('gulp-imagemin')

module.exports = () => {
  $.gulp.task('meta', () => {
    return $.gulp
      .src(`${$.conf.appRoot}/${$.conf.meta}/*`)
      .pipe(
        imagemin({
          interlaced: true,
          progressive: true,
          optimizationLevel: 5,
        })
      )
      .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.meta}`))
  })
}
