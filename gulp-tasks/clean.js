const del = require('del')

module.exports = () => {
  $.gulp.task('clean', (cb) => del([$.config.path.dev.base, $.config.path.build.base]).then(() => cb()))
}
