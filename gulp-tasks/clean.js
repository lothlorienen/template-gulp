module.exports = function clean(cb) {
  return $.del([$.conf.dev, $.conf.prod]).then(() => cb())
};
