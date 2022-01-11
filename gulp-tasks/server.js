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
    // Directories shorthand
    const dirScripts = $.config.path.src.scripts
    const dirHBS = $.config.path.src.hbs
    const dirStyles = $.config.path.src.styles
    // Tailwind Configs
    const twcMain = $.config.tailwind.stylesMain
    const twcUIKit = $.config.tailwind.stylesUIKit
    // Theme files
    const dbFiles = [`${$.config.path.src.db}/**/*.json`]
    const svgFilesIgnore = [`!${$.config.path.src.assets}/svg`, `!${$.config.path.src.assets}/svg/**/*`]
    const scriptsIgnore = [`!${dirScripts}/uikit/**/*`, `!${dirScripts}/uikit.ts`, `!${dirScripts}/vendors.ts`]
    // UIKit files
    const uikitStyles = [`${dirStyles}/uikit.{scss,css}`, `${dirStyles}/_uikit/**/*.{scss,css}`]
    const uikitStylesIgnore = [`!${dirStyles}/uikit.{scss,css}`, `!${dirStyles}/_uikit/**/*.{scss,css}`]
    const uikitHbs = [`${dirHBS}/uikit.hbs`, `${dirHBS}/uikit/**/*.hbs`]
    const uikitHbsIgnore = [`!${dirHBS}/uikit.hbs`, `!${dirHBS}/uikit/**/*.hbs`]
    // Track files
    const sourceStylesUIKit = [...uikitStyles, twcUIKit]
    const sourceFilesUIKit = [...uikitHbs, ...dbFiles]
    const sourceScriptsUIKit = [`${dirScripts}/uikit/**/*`, `${dirScripts}/uikit.ts`]
    const sourceStylesMain = [`${dirStyles}/**/*.{scss,css}`, ...uikitStylesIgnore, twcMain]
    const sourceFilesMain = [`${dirHBS}/**/*.hbs`, ...uikitHbsIgnore, ...dbFiles]
    const sourceScriptsMain = [`${dirScripts}/**/*.{js,ts}`, ...scriptsIgnore]
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
    $.gulp.watch([`${dirScripts}/vendors.ts`], $.gulp.series('scriptsVendors'))
    $.gulp.watch([`${$.config.path.src.svgSprite}/*.svg`], $.gulp.series('svg:sprite'))
    $.gulp.watch([`${$.config.path.src.svgInline}/*.svg`], $.gulp.series('svg:inline'))
    $.gulp.watch([`${$.config.path.src.assets}/**/*`, ...svgFilesIgnore], $.gulp.series('assets'))
  })
}
