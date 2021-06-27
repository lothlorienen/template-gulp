module.exports = () => {
  $.gulp.task('ftp', () => {
    const ftpConfig = 'ftp' in $.conf ? $.conf.ftp : null;

    if (ftpConfig === null || ftpConfig.enabled === false) return false;

    return gulp.src([`${$.conf.outputPath}/**/*`, `!**/.git/**`], { dot: true })
      .pipe($.gulpPlugin.ftp({
        host: ftpConfig.host,
        user: ftpConfig.login,
        pass: ftpConfig.password,
        remotePath: ftpConfig.remotePath,
      }))
      .pipe($.gulpPlugin.util.noop());
  });

  $.gulp.task('sftp', () => {
    const ftpConfig = 'sftp' in $.conf ? $.conf.sftp : null;

    if (ftpConfig === null || ftpConfig.enabled === false) return false;

    return $.gulp.src([`${$.conf.outputPath}/**/*`, `!**/.git/**`], { dot: true })
      .pipe($.gulpPlugin.sftpFix({
        host: ftpConfig.host,
        user: ftpConfig.login,
        pass: ftpConfig.password,
        remotePath: ftpConfig.remotePath,
      }))
      .pipe($.gulpPlugin.util.noop());
  });
};
