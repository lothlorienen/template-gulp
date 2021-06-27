module.exports = function server(cb) {
  $.bs.init({
    notify: false,
    logPrefix: `${$.conf.siteName ?? 'Starter template'}`,
    // logFileChanges: false,
    server: [$.conf.outputPath, $.conf.source],
    startPath: '/html/',
    logSnippet: false,
  })

  $.gulp.watch(
    [`${$.conf.source}/${$.conf.styles}/**/*.{scss, sass, css}`],
    $.gulp.series('styles'),
  )
  $.gulp.watch(
    [`${$.conf.source}/${$.conf.scripts}/**/*.js`,],
    $.gulp.series('scripts'),
  )
  $.gulp.watch(
    [
      `${$.conf.source}/${$.conf.hbs}/**/*`,
      `${$.conf.source}/${$.conf.db}/db.json`,
    ],
    $.gulp.series(['hbs', 'prepareHtmlDev']),
  )
  $.gulp.watch(
    [`${$.conf.source}/${$.conf.svgSprite}/*.svg`],
    $.gulp.series('svg:sprite'),
  )
  $.gulp.watch(
    [`${$.conf.source}/${$.conf.svgInline}/*.svg`],
    $.gulp.series('svg:inline'),
  )
  $.gulp.watch(
    [
      `${$.conf.source}/${$.conf.assets}/**/*`,
      `!${$.conf.source}/${$.conf.assets}/svg`,
      `!${$.conf.source}/${$.conf.assets}/svg/**/*`
    ],
    $.gulp.series('assets'),
  )

  return cb()
};
