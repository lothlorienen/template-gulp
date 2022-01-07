const del = require('del')

module.exports = () => {
  $.gulp.task('clean', (cb) => del([$.conf.dev, $.conf.prod]).then(() => cb()))
}
