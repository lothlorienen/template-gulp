module.exports = () => {
  $.gulp.task('clean',
    $.del.bind(null, [$.config.devOutput, $.config.prodOutput], { dot: true }),
  );
};
