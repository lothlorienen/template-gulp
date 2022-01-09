const gulpCompileHandlebars = require('gulp-compile-handlebars')
const htmlMin = require('gulp-htmlmin')
const fs = require('fs')

module.exports = (cb, buildProd = false) => {
  const randomIntNum = (min, max) => Math.round(min - 0.5 + Math.random() * (max - min + 1))
  const initParams = {
    cache: randomIntNum(1, 5000),
    dynamicEntry: $.config.options.dynamicEntry && $.config.isProd,
  }
  const options = {
    ignorePartials: true,
    batch: [`${$.config.path.src.hbs}/layouts`, `${$.config.path.src.hbs}/partials`],
    helpers: {
      times: function (n, block) {
        const result = []
        for (let i = 0; i < n; ++i) result.push(block.fn(i + 1))

        return result.join('')
      },
      when: function (v1, operator, v2, options) {
        switch (operator) {
          case '===':
            return v1 === v2 ? options.fn(this) : options.inverse(this)
          case '!==':
            return v1 !== v2 ? options.fn(this) : options.inverse(this)
          case '<':
            return v1 < v2 ? options.fn(this) : options.inverse(this)
          case '<=':
            return v1 <= v2 ? options.fn(this) : options.inverse(this)
          case '>':
            return v1 > v2 ? options.fn(this) : options.inverse(this)
          case '>=':
            return v1 >= v2 ? options.fn(this) : options.inverse(this)
          case '&&':
            return v1 && v2 ? options.fn(this) : options.inverse(this)
          case '||':
            return v1 || v2 ? options.fn(this) : options.inverse(this)
          default:
            return options.inverse(this)
        }
      },
      ifCond: function (v1, v2, options) {
        if (v1 === v2) return options.fn(this)

        return options.inverse(this)
      },
      concat: function (...args) {
        return `${args.slice(0, -1).join('')}`
      },
      ifUseWebp: function (block) {
        if ($.config.options.buildWebp) return block.fn(this)
        else return block.inverse(this)
      },
    },
  }

  $.gulp.task('hbs', () => {
    // todo: сделать автоматическое развертывание файлов
    const base = JSON.parse(fs.readFileSync(`${$.config.path.src.db}/db.json`).toString())
    const links = JSON.parse(fs.readFileSync(`${$.config.path.src.db}/links.json`).toString())
    const db = { ...initParams, ...base, ...links }

    // если нужна сборка с линовкой страниц
    if (buildProd) {
      // todo
      console.log('buildProd')

      return $.gulp
        .src([`${$.config.hbs}/pages/*.hbs`])
        .pipe($.plumber())
        .pipe(gulpCompileHandlebars(db, options))
        .pipe(
          $.gulpRename((path) => {
            const string = path.basename

            if (string.match('--')) {
              const newPath = string.split('--').join('/')
              path.dirname = `${newPath}`
            } else if (!string.match('home')) {
              path.dirname = string
            }

            path.basename = 'index'
            path.extname = '.html'
          })
        )
        .pipe(htmlMin({ collapseWhitespace: true, removeAttributeQuotes: true }))
        .pipe($.gulp.dest(`${$.config.path.output.base}`))
        .pipe($.server.stream())
    }

    // в случае, если у нас сборка обычная
    return $.gulp
      .src([
        `${$.config.path.src.hbs}/ajax/*.hbs`,
        `${$.config.path.src.hbs}/pages/*.hbs`,
        `${$.config.path.src.hbs}/partials/core/ui-kit/page.hbs`,
      ])
      .pipe($.plumber())
      .pipe(gulpCompileHandlebars(db, options))
      .pipe(
        $.gulpRename((path) => {
          const string = path.basename

          if (string === 'page') path.basename = 'uikit'

          path.dirname = ''
          path.extname = '.html'
        })
      )
      .pipe(htmlMin({ collapseWhitespace: true, removeAttributeQuotes: true }))
      .pipe($.gulp.dest(`${$.config.path.output.base}/${$.config.path.output.html}`))
      .pipe($.server.stream())
  })
}
