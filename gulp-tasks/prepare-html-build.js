const fs = require('fs')

module.exports = (done) => {
  $.gulp.task('prepareHtmlBuild', () => {
    // Исходные данные
    const metaImages = fs.readdirSync(`${$.config.path.src.preview}`) // изображения
    const templates = fs.readdirSync(`${$.config.path.src.hbs}/pages`).concat([`page.hbs`]) // названия шаблонов страниц
    const previewFolder = $.config.path.output.meta // Корневая папка для превью-изображений
    const htmlOutput = `${$.config.path.output.base}/${$.config.path.output.html}` // куда уходят файлы?

    const html = [] // Массив генерируемых элементов
    const pages = {} // Объект, содержащий информацию о всех страницах

    // Наполняем объект Pages информацией из meta-изображений
    for (const meta of metaImages) {
      if (meta === '.gitkeep' || meta === '.DS_Store') continue

      // Получаем имя шаблона/страницы
      const pageName = meta.substring(meta.indexOf('_') + 1, meta.lastIndexOf('.'))

      // Создаем объект с названием страницы и присваиваем ему изображение
      pages[pageName] = {}
      pages[pageName].image = meta
    }

    const filenames = templates.map((name) => name.replace('.hbs', ''))
    filenames.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

    // Наполняем объект Pages информацией из шаблонов
    for (const template of templates) {
      if (template === 'index' || template === '.DS_Store') continue

      // Получаем имя шаблона/страницы
      let pageName = template

      if (pageName === 'page') pageName = 'uikit'
      // Проверяем, существует ли данная страница
      if (pages[pageName] === undefined) pages[pageName] = {}

      const filename = pageName === 'uikit' ? 'partials/core/ui-kit/page' : 'pages/' + pageName

      // Получаем доступ к локальному файлу текущей страницы
      const file = fs.readFileSync(`${$.config.path.src.hbs}/${filename}.hbs`).toString()

      // Получаем заголовок страницы
      if (file.indexOf('{{!') !== -1) {
        pages[pageName].title = file.substring(3, file.indexOf('}}'))
      }

      // Получаем данные готовой страницы
      const hbs = fs.readFileSync(`${$.config.path.output.base}/html/${pageName}.html`).toString()

      // Если заголовка в странице нет, то заменяем его на полученный из шаблона
      if (hbs.indexOf(`<title></title>`) !== -1) {
        fs.writeFileSync(
          `${$.config.path.output.base}/html/${pageName}.html`,
          hbs.replace(/<title>(.*)/, '<title>' + pages[pageName] + '</title>')
        )
      }

      const imgSrc = `./${previewFolder}/${pages[pageName].image ?? '1000_default.svg'}`
      const linkClass = pages[pageName].image === undefined ? 'main__link main__link--default' : 'main__link'

      // Генерируем данные в наш массив со страницами
      html.push(`
        <li class="main__item">
          <article class="main__article">
            <h2 class="main__title">${pages[pageName].title}</h2>
            <a
              class="${linkClass}"
              href="./html/${pageName}.html"
              title="${pages[pageName].title}"
              aria-label="Link to ${pages[pageName].title} page."
            >
              <img
                src="${imgSrc}"
                alt="Preview image for ${pages[pageName].title}."
                loading="lazy"
              />
            </a>
          </article>
        </li>`)
    }

    // Сортируем полученный массив элементов в соотсветствии с порядком, заданным в мета-изображениях
    html.sort((a, b) => {
      const searchValue = `./${previewFolder}/`
      let tempA = a.slice(a.lastIndexOf(searchValue) + searchValue.length, a.lastIndexOf('_'))
      let tempB = b.slice(b.lastIndexOf(searchValue) + searchValue.length, b.lastIndexOf('_'))

      tempA.charAt(0) === '0' ? (tempA = tempA.slice(1)) : tempA
      tempB.charAt(0) === '0' ? (tempB = tempB.slice(1)) : tempB

      return Number(tempA) - Number(tempB)
    })

    const sourceTemplate = fs.readFileSync('./config/template-build.html').toString()

    // Получаем время сборки
    const date = new Date()
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timezone: 'Europe/Moscow',
      hour: 'numeric',
      minute: 'numeric',
    }

    // Подставляем полученные данные и генерируем билд
    fs.writeFileSync(
      `${$.config.path.output.base}/index.html`,
      sourceTemplate
        .replace('{{items}}', `${html.join('')}`)
        .replace(/{{siteName}}/g, $.config.siteName)
        .replace('{{buildDate}}', new Intl.DateTimeFormat('ru', options).format(date))
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
              let href = jQuery(this).attr('href')

              if (
                !href ||
                href.substr(0, 1) === '#' ||
                href.substr(0, 4) !== 'tel:' ||
                href.substr(0, 4) !== 'ftp:' ||
                href.substr(0, 5) !== 'file:' ||
                href.substr(0, 5) !== 'http:' ||
                href.substr(0, 6) !== 'https:' ||
                href.substr(0, 7) !== 'mailto:'
              ) {
                return
              }

              if (href.substr(0, 6) === '/html/') {
                href = href.substr(6)
              }

              let newHref = '/' + (href[0] === '/' ? href.substr(1) : href)
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
      .pipe($.server.reload({ stream: true }))
  })
}
