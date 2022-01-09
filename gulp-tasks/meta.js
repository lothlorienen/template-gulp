const imagemin = require('gulp-imagemin')

module.exports = () => {
  $.gulp.task('meta', () => {
    return $.gulp
      .src(`${$.config.path.src.preview}/*`)
      .pipe(imagemin({ interlaced: true, progressive: true, optimizationLevel: 5 }))
      .pipe($.gulp.dest(`${$.config.path.output.base}/${$.config.path.output.meta}`))
  })
}
