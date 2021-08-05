import gulpSvgMin from 'gulp-svgmin'
import gulpSvgSprite from 'gulp-svg-sprite'
import gulpReplace from 'gulp-replace'

export const svgInline = () => {
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
                dest: `${$.conf.styles}/core/svg/_spriteInline.scss`,
                template: `./config/sprite-template-inline.scss`,
              },
            },
          },
        },
      })
    )
    .pipe($.gulp.dest('./'))
}
export const svgSprite = () => {
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
                dest: `${$.conf.styles}/core/svg/_sprite.scss`,
                template: `./config/sprite-template.scss`,
              },
            },
          },
        },
      })
    )
    .pipe($.gulp.dest('./'))
}
