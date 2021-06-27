module.exports = function serve(cb) {
  $.bs.init({
    notify: false,
    logPrefix: `${$.conf.siteName ?? 'Starter template'}`,
    // logFileChanges: false,
    server: [$.conf.outputPath, $.conf.source],
    startPath: '/html/',
    logSnippet: false,
  })

  const assetsPath = `${$.conf.source}/${$.conf.assets}`
  const hbsPath = `${$.conf.source}/${$.conf.hbs}`

  $.gulp.watch([`${$.conf.source}/${$.conf.styles}/**/*.{scss, sass, css}`], $.gulp.series($.task.styles))
  // $.gulp.watch([`${$.conf.source}/${$.conf.scripts}/**/*.js`,], $.gulp.series('scripts'))
  // $.gulp.watch([`${hbsPath}/**/*`, `${$.conf.source}/${$.conf.db}/db.json`], $.gulp.series(['hbs', 'prepareHtmlDev']))
  // $.gulp.watch([`${$.conf.source}/${$.conf.svgSprite}/*.svg`], $.gulp.series('svg:sprite'))
  // $.gulp.watch([`${$.conf.source}/${$.conf.svgInline}/*.svg`], $.gulp.series('svg:inline'))
  // $.gulp.watch([`${assetsPath}/**/*`, `!${assetsPath}/svg`, `!${assetsPath}/svg/**/*`], $.gulp.series('assets'))

  return cb()
}
