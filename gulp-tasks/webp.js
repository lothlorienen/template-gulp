module.exports = () => {
  $.gulp.task('webp', () => {
    if (!$.conf.buildWebp) return $.gulp.src('.', {allowEmpty: true});

    return $.gulp.src([`${$.conf.appRoot}/${$.conf.assets}/images/**/*`,])
      .pipe($.webp({quality: 100}))
      .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.assets}/images`));
  });
};
