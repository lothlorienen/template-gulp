const imagemin = require('gulp-imagemin')

module.exports = () => {
  $.gulp.task('imageMin', () => {
    if (!$.conf.imageMin) return $.gulp.src('.', { allowEmpty: true })

    return $.gulp
      .src(`${$.conf.images}/**/*.{png,jpg,gif}`)
      .pipe(
        imagemin({
          interlaced: true,
          progressive: true,
          optimizationLevel: 5,
        })
      )
      .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.imagesOut}`))
  })
}
