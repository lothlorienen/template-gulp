module.exports = () => {
  $.gulp.task('serve', () => {
    $.server.init({
      ui: false,
      notify: false,
      logPrefix: `${$.conf.siteName ?? 'Starter template'}`,
      // logFileChanges: false,
      server: [$.conf.outputPath, $.conf.appRoot],
      startPath: '/html/',
      logSnippet: false,
    })
  })

  $.gulp.task('watch', () => {
    $.gulp.watch([`${$.conf.styles}/**/*.{scss,css}`], $.gulp.series('styles'))
    $.gulp.watch([`${$.conf.scripts}/**/*.{js,ts}`], $.gulp.series('scripts'))
    $.gulp.watch(
      [`${$.conf.hbs}/**/*.hbs`, `${$.conf.appRoot}/${$.conf.db}/**/*.json`],
      $.gulp.series(['hbs', 'prepareHtmlDev', 'styles'])
    )
    $.gulp.watch([`${$.conf.svgSprite}/*.svg`], $.gulp.series('svg:sprite'))
    $.gulp.watch([`${$.conf.svgInline}/*.svg`], $.gulp.series('svg:inline'))
    $.gulp.watch(
      [`${$.conf.assets}/**/*`, `!${$.conf.assets}/svg`, `!${$.conf.assets}/svg/**/*`],
      $.gulp.series('assets')
    )
  })
}
