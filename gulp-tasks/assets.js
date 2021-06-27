module.exports = () => {
  $.gulp.task('assets', () => {
    return $.gulp.src([
      `${$.conf.source}/${$.conf.assets}/**/*`,
      `!${$.conf.source}/${$.conf.assets}/svg`,
      `!${$.conf.source}/${$.conf.assets}/svg/**/*`,
    ])
      .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.assets}`))
      .pipe($.bs.reload({stream: true}));
  });
};
