const gulpSvgMin = require('gulp-svgmin')
const gulpSvgSprite = require('gulp-svg-sprite')
const gulpReplace = require('gulp-replace')

module.exports = () => {
  $.gulp.task('svg:sprite', () => {
    return $.gulp
      .src(`${$.config.path.src.svgSprite}/**/*.svg`)
      .pipe(gulpSvgMin())
      .pipe(
        gulpSvgSprite({
          mode: {
            css: {
              spacing: {
                padding: 5,
              },
              layout: 'diagonal',
              dest: './',
              sprite: `${$.config.path.output.base}/${$.config.path.output.images}/sprite.svg`,
              bust: false,
              render: {
                scss: {
                  dest: `${$.config.path.src.styles}/2-vendors/svg/_sprite.scss`,
                  template: `./config/sprite-template.scss`,
                },
              },
            },
          },
        })
      )
      .pipe($.gulp.dest('./'))
  })

  $.gulp.task('svg:inline', () => {
    return $.gulp
      .src(`${$.config.path.src.svgInline}/**/*.svg`)
      .pipe(
        gulpSvgMin({
          js2svg: { pretty: true },
        })
      )
      .pipe(
        $.cheerio({
          run: function ($) {
            $('title').remove()
            $('style').remove()
          },
          parserOptions: { xmlMode: true },
        })
      )
      .pipe(gulpReplace('&gt;', '>'))
      .pipe(
        gulpSvgSprite({
          mode: {
            symbol: {
              dest: './',
              example: false,
              bust: false,
              sprite: `${$.config.path.output.base}/${$.config.path.output.images}/spriteInline.svg`,
              inline: false,
              render: {
                scss: {
                  dest: `${$.config.path.src.styles}/2-vendors/svg/_spriteInline.scss`,
                  template: `./config/sprite-template-inline.scss`,
                },
              },
            },
          },
        })
      )
      .pipe($.gulp.dest('./'))
  })
}
