import imagemin from 'gulp-imagemin'

export const imagesOpt = () => {
  if (!$.conf.imageMin) return $.gulp.src('.', { allowEmpty: true })

  return $.gulp
    .src(`${$.conf.images}/**/*.{png,jpg,gif}`)
    .pipe(
      imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
      })
    )
    .pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.imagesOut}`))
}
