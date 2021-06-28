export const serve = (cb) => {
  $.bs.init({
    notify: false,
    logPrefix: `${$.conf.siteName ?? 'Starter template'}`,
    // logFileChanges: false,
    server: [$.conf.outputPath, $.conf.appRoot],
    startPath: '/html/',
    logSnippet: false,
  })

  $.gulp.watch([`${$.conf.styles}/**/*.{scss, sass, css}`], $.gulp.series($.task.styles))
  // $.gulp.watch([`${$.conf.scripts}/**/*.js`,], $.gulp.series('scripts'))
  // $.gulp.watch([`${$.conf.hbs}/**/*`, `${$.conf.db}/db.json`], $.gulp.series(['hbs', 'prepareHtmlDev']))
  $.gulp.watch([`${$.conf.svgSprite}/*.svg`], $.gulp.series($.task.svgSprite))
  $.gulp.watch([`${$.conf.svgInline}/*.svg`], $.gulp.series($.task.svgInline))
  $.gulp.watch([`${$.conf.assets}/**/*`, `!${$.conf.assets}/svg`, `!${$.conf.assets}/svg/**/*`], $.gulp.series($.task.assets))

  return cb()
}
