module.exports = () => {
  $.gulp.task('imageMin', () => {
    if (!$.conf.imageMin) return $.gulp.src('.', {allowEmpty: true});

    return $.gulp.src(`${$.conf.outputPath}/${$.conf.images}/**/*.{png,jpg,gif}`)
      .pipe($.gulpPlugin.imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
      }))
      .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.images}`));
  });
};
