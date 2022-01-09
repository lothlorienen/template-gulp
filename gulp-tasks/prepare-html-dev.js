const fs = require('fs')

module.exports = () => {
  $.gulp.task('prepareHtmlDev', () => {
    const templates = fs.readdirSync(`${$.config.path.src.hbs}/pages`).concat(['page.hbs'])
    const htmlOutput = `${$.config.path.output.base}/${$.config.path.output.html}` // куда уходят файлы?
    const html = []
    const pages = {}

    // Сортируем файлы в алфавитном порядке
    const filenames = templates.map((name) => name.replace('.hbs', ''))
    filenames.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

    for (const name of filenames) {
      if (name === 'index' || name === '.DS_Store') continue

      let pageName = name

      if (pageName === 'page') pageName = 'uikit'
      if (pages[pageName] === undefined) pages[pageName] = {}

      const filename = pageName === 'uikit' ? 'partials/core/ui-kit/page' : `pages/${pageName}`
      const file = fs.readFileSync(`${$.config.path.src.hbs}/${filename}.hbs`).toString()

      if (file.indexOf('{{!') !== -1) {
        pages[pageName].title = file.substring(3, file.indexOf('}}'))
      }

      const { title } = pages[pageName]

      html.push(`<li><a class="transition hover:text-sky-400 red" href="${pageName}.html">${title}</a></li>`)
    }

    const templateFile = fs.readFileSync('./config/template-dev.html').toString()

    fs.writeFileSync(
      `${htmlOutput}/index.html`,
      templateFile.replace('{{items}}', `${html.join('')}`).replace(/{{siteName}}/g, $.config.siteName)
    )

    return $.gulp
      .src(`${htmlOutput}/**/*.html`)
      .pipe(
        $.cheerio({
          run: (jQuery) => {
            jQuery('script').each(function () {
              let src = jQuery(this).attr('src')

              if (src !== undefined && src.substr(0, 5) !== 'http:' && src.substr(0, 6) !== 'https:')
                src = `../${$.config.path.output.scripts}/${src}`

              jQuery(this).attr('src', src)
            })
            jQuery('a').each(function () {
              const href = jQuery(this).attr('href')

              if (
                !href ||
                href.substr(0, 1) === '#' ||
                href.substr(0, 4) === 'tel:' ||
                href.substr(0, 4) === 'ftp:' ||
                href.substr(0, 5) === 'file:' ||
                href.substr(0, 5) === 'http:' ||
                href.substr(0, 6) === 'https:' ||
                href.substr(0, 7) === 'mailto:'
              )
                return

              if (href.substr(0, 6) === `/${$.config.path.output.html}/`) return

              let newHref = `/${$.config.path.output.html}/` + (href[0] === '/' ? href.substr(1) : href)

              if (newHref.substr(-5) !== '.html') {
                newHref = newHref + '.html'
              }

              jQuery(this).attr('href', newHref)
            })
          },
          parserOptions: { decodeEntities: false },
        })
      )
      .pipe($.gulp.dest(`${htmlOutput}/`))
  })
}
