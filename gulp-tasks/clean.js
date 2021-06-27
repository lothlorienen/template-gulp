module.exports = () => {
  $.gulp.task('clean',
    $.del.sync([$.conf.dev, $.conf.prod]),
  );
};
