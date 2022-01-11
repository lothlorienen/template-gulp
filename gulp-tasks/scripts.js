const gulpEsbuild = require('gulp-esbuild')

module.exports = () => {
  const esConfig = {
    // outfile: 'theme.min.js',
    outdir: '.',
    bundle: true,
    minify: $.config.env.isProduction,
    sourcemap: !$.config.env.isProduction,
    loader: {
      '.ts': 'ts',
    },
    // format: "esm",
    platform: 'browser',
    target: ['es6'],
    entryNames: '[name].min',
  }

  $.gulp.task('scriptsMain', () => {
    const esbuild = $.config.env.isProduction ? gulpEsbuild : gulpEsbuild.createGulpEsbuild({ incremental: true })

    return $.gulp
      .src([`${$.config.path.src.scripts}/theme.ts`])
      .pipe($.plumber())
      .pipe(
        esbuild({
          ...esConfig,
          minify: $.config.env.isProduction,
          sourcemap: !$.config.env.isProduction,
        })
      )
      .pipe($.gulp.dest(`${$.config.path.output.base}/${$.config.path.output.scripts}/`))
      .pipe($.server.stream())
  })
  $.gulp.task('scriptsUIKit', () => {
    const esbuild = $.config.env.isProduction ? gulpEsbuild : gulpEsbuild.createGulpEsbuild({ incremental: true })

    return $.gulp
      .src([`${$.config.path.src.scripts}/uikit.ts`])
      .pipe($.plumber())
      .pipe(
        esbuild({
          ...esConfig,
          minify: $.config.env.isProduction,
          sourcemap: !$.config.env.isProduction,
        })
      )
      .pipe($.gulp.dest(`${$.config.path.output.base}/${$.config.path.output.scripts}/`))
      .pipe($.server.stream())
  })
  $.gulp.task('scriptsVendors', () => {
    const esbuild = $.config.env.isProduction ? gulpEsbuild : gulpEsbuild.createGulpEsbuild({ incremental: true })

    return $.gulp
      .src([`${$.config.path.src.scripts}/vendors.ts`])
      .pipe($.plumber())
      .pipe(
        esbuild({
          ...esConfig,
          minify: $.config.env.isProduction,
          sourcemap: !$.config.env.isProduction,
        })
      )
      .pipe($.gulp.dest(`${$.config.path.output.base}/${$.config.path.output.scripts}/`))
      .pipe($.server.stream())
  })
}
