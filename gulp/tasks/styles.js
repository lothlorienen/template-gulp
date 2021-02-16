module.exports = () => {
  const sheets = [
    {
      src: `./${$.config.sourcePath}/${$.config.stylesPath}/main.scss`,
    },
    {
      src: `./${$.config.sourcePath}/${$.config.stylesPath}/uikit.scss`,
    },
  ];

  $.gulp.task('styles', (done) => {
    if ($.config.cssMin) {
      sheets.map((file) => {
        return $.gulp.src([file.src])
          .pipe($.gulpPlugin.sass({ importer: $.tildeImporter }).on('error', $.gulpPlugin.sass.logError))
          .pipe($.gulpPlugin.autoprefixer())
          .pipe($.gulpPlugin.csso())
          .pipe($.gulpPlugin.cssmin())
          .pipe($.gulpPlugin.rename({ extname: '.min.css' }))
          .pipe($.gulp.dest(`${$.config.outputPath}/css`))
          .pipe($.bs.reload({ stream: true }));
      });
      done();
    } else {
      sheets.map((file) => {
        return $.gulp.src([file.src])
          .pipe($.gulpPlugin.sourcemaps.init())
          .pipe($.gulpPlugin.sass({
            importer: $.tildeImporter,
          }).on('error', $.gulpPlugin.sass.logError))
          .pipe($.gulpPlugin.autoprefixer())
          .pipe($.gulpPlugin.csso())
          .pipe($.gulpPlugin.rename({ extname: '.min.css' }))
          .pipe($.gulpPlugin.sourcemaps.write())
          .pipe($.gulp.dest(`${$.config.outputPath}/css`))
          .pipe($.gulpPlugin.csslint('./config/.csslintrc'))
          .pipe($.bs.reload({ stream: true }));
      });
      done();
    }
  });
};
