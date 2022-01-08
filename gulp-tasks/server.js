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
    // filepath
    const uikitStyles = [`${$.conf.styles}/uikit.{scss,css}`, `${$.conf.styles}/_uikit/**/*.{scss,css}`]
    const noUIKitStyles = [`!${$.conf.styles}/uikit.{scss,css}`, `!${$.conf.styles}/_uikit/**/*.{scss,css}`]
    const uikitHbsFiles = [`${$.conf.hbs}/uikit.hbs`, `${$.conf.hbs}/uikit/**/*.hbs`]
    const noUIKitHbsFiles = [`!${$.conf.hbs}/uikit.hbs`, `!${$.conf.hbs}/uikit/**/*.hbs`]
    const dbPath = [`${$.conf.appRoot}/${$.conf.db}/**/*.json`]
    const noSVGFiles = [`!${$.conf.assets}/svg`, `!${$.conf.assets}/svg/**/*`]
    // Tasks
    const transpileHBS = ['hbs', 'prepareHtmlDev']
    // UIKit
    $.gulp.watch([...uikitStyles], $.gulp.series('stylesUIKit'))
    $.gulp.watch([...uikitHbsFiles, ...dbPath], $.gulp.series([...transpileHBS, 'stylesUIKit']))
    // Project files
    $.gulp.watch([`${$.conf.styles}/**/*.{scss,css}`, ...noUIKitStyles], $.gulp.series('stylesMain'))
    $.gulp.watch(
      [`${$.conf.hbs}/**/*.hbs`, ...noUIKitHbsFiles, ...dbPath],
      $.gulp.series([...transpileHBS, 'stylesMain'])
    )
    $.gulp.watch([`${$.conf.scripts}/**/*.{js,ts}`], $.gulp.series('scripts'))
    // SVG
    $.gulp.watch([`${$.conf.svgSprite}/*.svg`], $.gulp.series('svg:sprite'))
    $.gulp.watch([`${$.conf.svgInline}/*.svg`], $.gulp.series('svg:inline'))
    // Assets
    $.gulp.watch([`${$.conf.assets}/**/*`, ...noSVGFiles], $.gulp.series('assets'))
  })
}
