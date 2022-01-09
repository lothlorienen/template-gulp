// необходимые пакеты
const { src, dest, task, watch, series, parallel } = require('gulp')
const cheerio = require('gulp-cheerio')
const plumber = require('gulp-plumber')
const gulpRename = require('gulp-rename')
const bs = require('browser-sync')
const config = require('./config/config.js')

// Задаём режим сборки
const setMode = (isProduction = false) => {
  return (cb) => {
    process.env.NODE_ENV = isProduction ? 'production' : 'development'
    $.config.env.isProduction = isProduction
    $.config.path.output.base = isProduction ? $.config.path.build.base : $.config.path.dev.base
    cb()
  }
}

// объявляем глобальную переменную, создавая уникальные интсансы, к которым будем обращаться
global.$ = {
  cheerio,
  config,
  gulp: { src, dest, task, watch, series, parallel },
  gulpRename,
  plumber,
  server: bs.create(),
  task: require('./gulp-tasks/_index.js'),
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
