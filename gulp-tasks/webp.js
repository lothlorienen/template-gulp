const webp = require('gulp-webp')

module.exports = () => {
  $.gulp.task('webp', () => {
    if (!$.config.options.buildWebp) return $.gulp.src('.', { allowEmpty: true })

    return $.gulp
      .src([`${$.config.path.src.images}/**/*`])
      .pipe(webp({ quality: 100 }))
      .pipe($.gulp.dest(`${$.config.path.output.base}/${$.config.path.output.images}`))
  })
}
