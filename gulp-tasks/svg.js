const gulpSvgMin = require('gulp-svgmin')
const gulpSvgSprite = require('gulp-svg-sprite')
const gulpReplace = require('gulp-replace')

module.exports = () => {
  $.gulp.task('svg:sprite', () => {
    return $.gulp
      .src(`${$.conf.svgSprite}/**/*.svg`)
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
              sprite: `${$.conf.outputPath}/${$.conf.imagesOut}/sprite.svg`,
              bust: false,
              render: {
                scss: {
                  dest: `${$.conf.styles}/2-vendors/svg/_sprite.scss`,
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
      .src(`${$.conf.svgInline}/**/*.svg`)
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
              sprite: `${$.conf.outputPath}/${$.conf.imagesOut}/spriteInline.svg`,
              inline: false,
              render: {
                scss: {
                  dest: `${$.conf.styles}/2-vendors/svg/_spriteInline.scss`,
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
