const imagemin = require('gulp-imagemin')

module.exports = () => {
  $.gulp.task('imageMin', () => {
    if (!$.config.options.imageMin) return $.gulp.src('.', { allowEmpty: true })

    return $.gulp
      .src(`${$.config.path.src.images}/**/*.{png,jpg,gif}`)
      .pipe(imagemin({ interlaced: true, progressive: true, optimizationLevel: 5 }))
      .pipe($.gulp.dest(`${$.config.path.output.base}/${$.config.path.output.images}`))
  })
}
