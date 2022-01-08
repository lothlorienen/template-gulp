// необходимые пакеты
const bs = require('browser-sync')
const cheerio = require('gulp-cheerio')
const conf = require('./config/config.js')
const { src, dest, task, watch, series, parallel } = require('gulp')
const gulpRename = require('gulp-rename')
const plumber = require('gulp-plumber')

// Задаём режим сборки
const setMode = (isProduction = false) => {
  return (cb) => {
    process.env.NODE_ENV = isProduction ? 'production' : 'development'
    $.conf.isProd = isProduction
    $.conf.outputPath = isProduction ? $.conf.prod : $.conf.dev
    cb()
  }
}
const twConfig = require('./tailwind.config.js')

// объявляем глобальную переменную, создавая уникальные интсансы, к которым будем обращаться
global.$ = {
  cheerio,
  conf,
  gulp: { src, dest, task, watch, series, parallel },
  gulpRename,
  plumber,
  server: bs.create(),
  task: require('./gulp-tasks/_index.js'),
  twConfig,
}

$.task.forEach((taskPath) => require(taskPath)())

// разбиваем задачи на группы
const styles = ['stylesMain', 'stylesUIKit']
const transpile = parallel('hbs', ...styles, 'scripts', 'assets', 'svg:sprite', 'svg:inline')
const setup = ['clean', transpile, 'webp']
const initServer = parallel('serve', 'watch')

// Инициализируем таски
exports.dev = series(setMode(), series(...setup, 'prepareHtmlDev'), initServer)
exports.build = series(setMode(true), series(...setup, 'prepareHtmlBuild'), parallel('meta', 'imageMin'))
