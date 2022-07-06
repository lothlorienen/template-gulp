module.exports = () => {
  $.gulp.task('assets', () => {
    const exclude = [`!${$.config.path.src.assets}/svg`, `!${$.config.path.src.assets}/svg/**/*`]
    return $.gulp
      .src([`${$.config.path.src.assets}/**/*`, ...exclude])
      .pipe($.gulp.dest(`${$.config.path.output.base}/${$.config.path.output.assets}`))
      .pipe($.server.stream())
  })
}
