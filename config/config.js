module.exports = {
  siteName: 'Starter Template',
  env: {
    isProduction: false,
  },
  options: {
    siteUrl: '#',
    dynamicEntry: false,
    imageMin: false,
    buildWebp: false,
  },
  tailwind: {
    stylesMain: './tailwind.config.js',
    stylesUIKit: './tailwind-uikit.config.js',
  },
  path: {
    root: './',
    src: {
      base: './src',
      app: './src/app',
      db: './src/app/db',
      hbs: './src/app/hbs',
      styles: './src/app/styles',
      scripts: './src/app/scripts',
      assets: './src/assets',
      fonts: './src/assets/fonts',
      images: './src/assets/images',
      videos: './src/assets/videos',
      svgInline: './src/assets/svg/inline',
      svgSprite: './src/assets/svg/sprite',
      pngSprite: './src/assets/png',
      preview: './src/app/preview',
    },
    dev: {
      base: '.tmp',
      templateCSS: './config/styles-dev.css',
    },
    build: {
      base: 'build',
      templateCSS: './config/styles-build.css',
    },
    output: {
      base: null,
      assets: 'assets',
      images: 'assets/images',
      html: 'html',
      meta: 'preview',
      scripts: 'scripts',
      styles: 'css',
    },
  },
}
