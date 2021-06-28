export const assets = () => {
  return $.gulp
    .src([`${$.conf.assets}/**/*`, `!${$.conf.assets}/svg`, `!${$.conf.assets}/svg/**/*`])
    .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.assetsOut}`))
    .pipe($.server.stream())
}
