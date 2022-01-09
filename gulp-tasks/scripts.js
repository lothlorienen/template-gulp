const gulpEsbuild = require('gulp-esbuild')

module.exports = () => {
  $.gulp.task('scripts', (done) => {
    const esbuild = $.config.env.isProduction ? gulpEsbuild : gulpEsbuild.createGulpEsbuild({ incremental: true })

    return $.gulp
      .src([`${$.config.path.src.scripts}/main.ts`, `${$.config.path.src.scripts}/vendors.ts`])
      .pipe($.plumber())
      .pipe(
        esbuild({
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
        })
      )
      .pipe($.gulp.dest(`${$.config.path.output.base}/${$.config.path.output.scripts}/`))
      .on('end', done)
  })
}
