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
    const ignoreUIKitStyles = [
      `!${$.config.path.src.styles}/uikit.{scss,css}`,
      `!${$.config.path.src.styles}/_uikit/**/*.{scss,css}`,
    ]
    const uikitHbsFiles = [`${$.config.path.src.hbs}/uikit.hbs`, `${$.config.path.src.hbs}/uikit/**/*.hbs`]
    const ignoreUIKitHbsFiles = [`!${$.config.path.src.hbs}/uikit.hbs`, `!${$.config.path.src.hbs}/uikit/**/*.hbs`]
    const dbPath = [`${$.config.path.src.db}/**/*.json`]
    const ignoreSVGFiles = [`!${$.config.path.src.assets}/svg`, `!${$.config.path.src.assets}/svg/**/*`]
    const ignoreScriptsFiles = [
      `!${$.config.path.src.scripts}/uikit/**/*`,
      `!${$.config.path.src.scripts}/uikit.ts`,
      `!${$.config.path.src.scripts}/vendors.ts`,
    ]

    const sourceStylesUIKit = [...uikitStyles, tailwindUIKitConfig]
    const sourceFilesUIKit = [...uikitHbsFiles, ...dbPath]
    const sourceScriptsUIKit = [`${$.config.path.src.scripts}/uikit/**/*`, `${$.config.path.src.scripts}/uikit.ts`]
    const sourceStylesMain = [`${$.config.path.src.styles}/**/*.{scss,css}`, ...ignoreUIKitStyles, tailwindConfig]
    const sourceFilesMain = [`${$.config.path.src.hbs}/**/*.hbs`, ...ignoreUIKitHbsFiles, ...dbPath]
    const sourceScriptsMain = [`${$.config.path.src.scripts}/**/*.{js,ts}`, ...ignoreScriptsFiles]
    const sourceDevFiles = [`./config/template-dev.html`, `./gulp-tasks/prepare-html-dev.js`]
    // Tasks
    const transpileHBS = ['hbs', 'prepareHtmlDev']

    $.gulp.watch(sourceStylesUIKit, $.gulp.series('stylesUIKit'))
    $.gulp.watch(sourceFilesUIKit, $.gulp.series([...transpileHBS, 'stylesUIKit']))
    $.gulp.watch(sourceStylesMain, $.gulp.series('stylesMain'))
    $.gulp.watch(sourceFilesMain, $.gulp.series(['hbs', 'stylesMain']))
    $.gulp.watch(sourceDevFiles, $.gulp.series([...transpileHBS, 'stylesDev']))
    $.gulp.watch(sourceScriptsMain, $.gulp.series('scriptsMain'))
    $.gulp.watch(sourceScriptsUIKit, $.gulp.series('scriptsUIKit'))
    $.gulp.watch([`${$.config.path.src.scripts}/vendors.ts`], $.gulp.series('scriptsVendors'))
    $.gulp.watch([`${$.config.path.src.svgSprite}/*.svg`], $.gulp.series('svg:sprite'))
    $.gulp.watch([`${$.config.path.src.svgInline}/*.svg`], $.gulp.series('svg:inline'))
    $.gulp.watch([`${$.config.path.src.assets}/**/*`, ...ignoreSVGFiles], $.gulp.series('assets'))
  })
}
