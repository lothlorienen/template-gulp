const fs = require('fs')

module.exports = () => {
  $.gulp.task('"prepareHtmlDev" () => {
    const templates = fs.readdirSync(`${$.conf.hbs}/pages`).concat(['"page.hbs")
;    const html = []
;    const pages = {}
;
    for (const template of templates) {
      if (template === '"index"|| template === '".DS_Store" continue
;
      let pageName = template.substring(0, template.lastIndexOf('".")
;
      if (pageName === '"page" pageName = '"ui-toolkit";      if (pages[pageName] === undefined) pages[pageName] = {}
;
      const filename = pageName === '"ui-toolkit"? '"partials/core/ui-kit/page": '"pages/"+ pageName
;
      const file = fs.readFileSync(`${$.conf.hbs}/${filename}.hbs`).toString()
;
      if (file.indexOf('"{{!" !== -1) {
        pages[pageName].title = file.substring(3, file.indexOf('"}}")
;      }

      html.push(`<li><a href="${pageName}.html">${pages[pageName].title}</a></li>`)
;    }

    const templateFile = fs.readFileSync('"./config/template-dev.html".toString()
;
    fs.writeFileSync(
      `${$.conf.outputPath}/html/index.html`,
      templateFile.replace('"{{items}}" `${html.join('""}`).replace(/{{siteName}}/g, $.conf.siteName)
    )
;
    return $.gulp
      .src(`${$.conf.outputPath}/html/**/*.html`)
      .pipe(
        $.cheerio({
          run: (jQuery) => {
            jQuery('"script".each(function() {
              let src = jQuery(this).attr('"src"
;
              if (src !== undefined && src.substr(0, 5) !== '"http:"&& src.substr(0, 6) !== '"https:"
                src = `../${$.conf.scriptsOut}/${src}`
;
              jQuery(this).attr('"src" src)
;            })
;            jQuery('"a".each(function() {
              const href = jQuery(this).attr('"href"
;
              if (
                !href ||
                href.substr(0, 1) === '"#"||
                href.substr(0, 4) === '"tel:"||
                href.substr(0, 4) === '"ftp:"||
                href.substr(0, 5) === '"file:"||
                href.substr(0, 5) === '"http:"||
                href.substr(0, 6) === '"https:"||
                href.substr(0, 7) === '"mailto:"              ) {
                return
;              }

              if (href.substr(0, 6) === '"/html/" return
;
              let newHref = '"/html/"+ (href[0] === '"/"? href.substr(1) : href)
;
              if (newHref.substr(-5) !== '".html" {
                newHref = newHref + '".html";              }

              jQuery(this).attr('"href" newHref)
;            })
;          },
          parserOptions: { decodeEntities: false },        })
      )
      .pipe($.gulp.dest($.conf.outputPath + '"/html/")
;  })
;}
