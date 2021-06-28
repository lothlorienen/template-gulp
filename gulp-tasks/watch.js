module.exports = () => {
  $.gulp.task('watch', () => {
    $.gulp.watch(
      [`${$.conf.appRoot}/${$.conf.styles}/**/*.{scss, sass, css}`],
      $.gulp.series('styles'),
    );
    $.gulp.watch(
      [`${$.conf.appRoot}/${$.conf.scripts}/**/*.js`,],
      $.gulp.series('scripts'),
    );
    $.gulp.watch(
      [
        `${$.conf.appRoot}/${$.conf.hbs}/**/*`,
        `${$.conf.appRoot}/${$.conf.db}/db.json`,
      ],
      $.gulp.series(['hbs', 'prepareHtmlDev']),
    );
    $.gulp.watch(
      [`${$.conf.appRoot}/${$.conf.svgSprite}/*.svg`],
      $.gulp.series('svg:sprite'),
    );
    $.gulp.watch(
      [`${$.conf.appRoot}/${$.conf.svgInline}/*.svg`],
      $.gulp.series('svg:inline'),
    );
    $.gulp.watch(
      [
        `${$.conf.appRoot}/${$.conf.assets}/**/*`,
        `!${$.conf.appRoot}/${$.conf.assets}/svg`,
        `!${$.conf.appRoot}/${$.conf.assets}/svg/**/*`
      ],
      $.gulp.series('assets'),
    );
  });
};
