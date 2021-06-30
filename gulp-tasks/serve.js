export const serve = () => {
  $.server.init({
    ui: false,
    notify: false,
    logPrefix: `${$.conf.siteName ?? 'Starter template'}`,
    // logFileChanges: false,
    server: [$.conf.outputPath, $.conf.appRoot],
    startPath: '/html/',
    logSnippet: false,
  })
}

export const watch = () => {
  $.gulp.watch([`${$.conf.styles}/**/*.{scss, sass, css}`], $.gulp.series($.task.styles))
  $.gulp.watch([`${$.conf.scripts}/**/*.{js,ts}`], $.gulp.series($.task.js))
  $.gulp.watch([
    `${$.conf.hbs}/**/*`,
    `${$.conf.db}/db/*`
  ], $.gulp.series([$.task.hbs, $.task.prepareHtmlDev]))
  $.gulp.watch([`${$.conf.svgSprite}/*.svg`], $.gulp.series($.task.svgSprite))
  $.gulp.watch([`${$.conf.svgInline}/*.svg`], $.gulp.series($.task.svgInline))
  $.gulp.watch([
    `${$.conf.assets}/**/*`,
    `!${$.conf.assets}/svg`,
    `!${$.conf.assets}/svg/**/*`
  ], $.gulp.series($.task.assets))
}
