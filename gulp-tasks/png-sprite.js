module.exports = () => {
  $.gulp.task('png:sprite', () => {
    const spriteData =
      $.gulp.src(`${$.conf.source}/${$.conf.pngSprite}/*.png`)
        .pipe($.gulpPlugin.spritesmith({
          imgName: 'sprite.png',
          cssName: 'png-sprite.scss',
          cssFormat: 'scss',
          algorithm: 'binary-tree',
          cssTemplate: './config/png-sprite-temp.scss',
          cssVarMap: function(sprite) {
            sprite.name = 'icon-' + sprite.name;
          },
        }));

    const destImg = spriteData.img.pipe($.gulp.dest(`${$.conf.outputPath}/${$.conf.pngSprite}`));
    const destCss = spriteData.css.pipe($.gulp.dest(`${$.conf.source}/${$.conf.styles}/png`));

    return $.merge(destImg, destCss);
  });
};
