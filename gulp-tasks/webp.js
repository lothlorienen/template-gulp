import webp from 'gulp-webp'

export const imageWebp = () => {
  if (!$.conf.buildWebp) return $.gulp.src('.', { allowEmpty: true })

  return $.gulp
    .src([`${$.conf.images}/**/*`])
    .pipe(webp({ quality: 100 }))
    .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.imagesOut}`))
}
