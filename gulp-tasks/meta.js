module.exports = () => {
  $.gulp.task('meta', () => {
    return $.gulp.src(`${$.conf.source}/${$.conf.meta}/*`)
      .pipe($.gulpPlugin.imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
      }))
      .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.meta}`));
  });
};
