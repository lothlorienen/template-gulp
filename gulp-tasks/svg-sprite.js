module.exports = () => {
  $.gulp.task('svg:sprite', () => {
    return $.gulp.src(`${$.conf.source}/${$.conf.svgSprite}/**/*.svg`)
      .pipe($.gulpPlugin.svgmin())
      .pipe($.gulpPlugin.svgSprite({
        mode: {
          css: {
            'spacing': {
              'padding': 5,
            },
            layout: 'diagonal',
            dest: './',
            sprite: `${$.conf.outputPath}/${$.conf.images}/sprite.svg`,
            bust: false,
            render: {
              'scss': {
                'dest': `${$.conf.source}/${$.conf.styles}/core/svg/_sprite.scss`,
                'template': `./config/sprite-template.scss`,
              },
            },
          },
        },
      }))
      .pipe($.gulp.dest('./'));
  });

  $.gulp.task('svg:inline', () => {
    return $.gulp.src(`${$.conf.source}/${$.conf.svgInline}/**/*.svg`)
      .pipe($.gulpPlugin.svgmin({
        js2svg: {
          pretty: true,
        },
      }))
      .pipe($.gulpPlugin.cheerio({
        run: function($) {
          $('title').remove();
          $('style').remove();
        },
        parserOptions: { xmlMode: true },
      }))
      .pipe($.gulpPlugin.replace('&gt;', '>'))
      .pipe($.gulpPlugin.svgSprite({
        mode: {
          symbol: {
            dest: './',
            example: false,
            bust: false,
            sprite: `${$.conf.outputPath}/${$.conf.images}/spriteInline.svg`,
            inline: false,
            render: {
              scss: {
                dest: `${$.conf.source}/${$.conf.styles}/core/svg/_spriteInline.scss`,
                template: `./config/sprite-template-inline.scss`,
              },
            },
          },
        },
      }))
      .pipe($.gulp.dest('./'));
  });
};
