const fs = require('fs')

module.exports = (done) => {
  $.gulp.task('prepareHtmlDev', () => {
    const templates = fs.readdirSync(`${$.config.path.src.hbs}/pages`).concat(['page.hbs'])
    const htmlOutput = `${$.config.path.output.base}/${$.config.path.output.html}` // куда уходят файлы?
    const html = []
    const pages = {}

    for (const template of templates) {
      if (template === 'index' || template === '.DS_Store') continue

      let pageName = template.substring(0, template.lastIndexOf('.'))

      if (pageName === 'page') pageName = 'uikit'
      if (pages[pageName] === undefined) pages[pageName] = {}

      const filename = pageName === 'uikit' ? 'partials/core/ui-kit/page' : 'pages/' + pageName

      const file = fs.readFileSync(`${$.config.path.src.hbs}/${filename}.hbs`).toString()

      if (file.indexOf('{{!') !== -1) {
        pages[pageName].title = file.substring(3, file.indexOf('}}'))
      }

      html.push(`<li><a href="${pageName}.html">${pages[pageName].title}</a></li>`)
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
