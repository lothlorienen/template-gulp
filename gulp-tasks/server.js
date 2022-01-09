module.exports = () => {
  $.gulp.task('serve', () => {
    $.server.init({
      ui: false,
      notify: false,
      logPrefix: `${$.config.siteName ?? 'Starter template'}`,
      // logFileChanges: false,
      server: [$.config.path.output.base, $.config.path.src.app],
      startPath: '/html/',
      logSnippet: false,
    })
  })

  $.gulp.task('watch', () => {
    // filepath
    const tailwindConfig = './tailwind.config.js'
    const tailwindUIKitConfig = './tailwind.config-uikit.js'
    const uikitStyles = [
      `${$.config.path.src.styles}/uikit.{scss,css}`,
      `${$.config.path.src.styles}/_uikit/**/*.{scss,css}`,
    ]
    const noUIKitStyles = [
      `!${$.config.path.src.styles}/uikit.{scss,css}`,
      `!${$.config.path.src.styles}/_uikit/**/*.{scss,css}`,
    ]
    const uikitHbsFiles = [`${$.config.path.src.hbs}/uikit.hbs`, `${$.config.path.src.hbs}/uikit/**/*.hbs`]
    const noUIKitHbsFiles = [`!${$.config.path.src.hbs}/uikit.hbs`, `!${$.config.path.src.hbs}/uikit/**/*.hbs`]
    const dbPath = [`${$.config.path.src.db}/**/*.json`]
    const noSVGFiles = [`!${$.config.path.src.assets}/svg`, `!${$.config.path.src.assets}/svg/**/*`]
    // Tasks
    const transpileHBS = ['hbs', 'prepareHtmlDev']
    // UIKit
    $.gulp.watch([...uikitStyles, tailwindUIKitConfig], $.gulp.series('stylesUIKit'))
    $.gulp.watch([...uikitHbsFiles, ...dbPath], $.gulp.series([...transpileHBS, 'stylesUIKit']))
    // Project files
    $.gulp.watch(
      [`${$.config.path.src.styles}/**/*.{scss,css}`, ...noUIKitStyles, tailwindConfig],
      $.gulp.series('stylesMain')
    )
    $.gulp.watch(
      [`${$.config.path.src.hbs}/**/*.hbs`, ...noUIKitHbsFiles, ...dbPath],
      $.gulp.series(['hbs', 'stylesMain'])
    )
    // Dev-template files
    $.gulp.watch(
      [`./config/template-dev.html`, `./gulp-tasks/prepare-html-dev.js`],
      $.gulp.series([...transpileHBS, 'stylesDev'])
    )
    $.gulp.watch([`${$.config.path.src.scripts}/**/*.{js,ts}`], $.gulp.series('scripts'))
    // SVG
    $.gulp.watch([`${$.config.path.src.svgSprite}/*.svg`], $.gulp.series('svg:sprite'))
    $.gulp.watch([`${$.config.path.src.svgInline}/*.svg`], $.gulp.series('svg:inline'))
    // Assets
    $.gulp.watch([`${$.config.path.src.assets}/**/*`, ...noSVGFiles], $.gulp.series('assets'))
  })
}
