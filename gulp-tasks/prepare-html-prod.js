export const prepareHtmlProd = () => {
  return $.gulp
    .src(`${$.conf.outputPath}/**/*.html`)
    .pipe(
      $.cheerio({
        run: (jQuery) => {
          jQuery('script').each(function () {
            let src = jQuery(this).attr('src')
            if (
              src !== undefined &&
              src.substr(0, 5) !== 'http:' &&
              src.substr(0, 6) !== 'https:'
            ) {
              src = `/${$.conf.scripts}/${src}`
            }

            jQuery(this).attr('src', src)
          })
          jQuery('meta').each(function () {
            let content = jQuery(this).attr('content')

            if (content !== undefined && content.substr(0, 2) === './') {
              content = content.substr(1)
            }

            if (content !== undefined && content.substr(0, 3) === '../') {
              content = content.substr(2)
            }

            jQuery(this).attr('content', content)
          })
          jQuery('link').each(function () {
            let href = jQuery(this).attr('href')

            if (href !== undefined && href.substr(0, 2) === './') {
              href = href.substr(1)
            }

            if (href !== undefined && href.substr(0, 3) === '../') {
              href = href.substr(2)
            }

            jQuery(this).attr('href', href)
          })
          jQuery('a').each(function () {
            let href = jQuery(this).attr('href')

            function checkLinkPath(checkPosition) {
              let linkPath = href.substring(
                checkPosition,
                href.lastIndexOf('.')
              )

              if (linkPath.match('--')) {
                let filePath = linkPath.split('--').join('/')
                return (href = `/${filePath}/`)
              } else if (!linkPath.match('home')) {
                return (href = `/${linkPath}/`)
              } else {
                return (href = `/`)
              }
            }

            if (href !== undefined && href.substr(0, 2) === './') {
              checkLinkPath(2)
            } else if (href !== undefined && href.substr(0, 3) === '../') {
              checkLinkPath(3)
            } else if (
              href !== undefined &&
              href.substr(0, 1) !== '#' &&
              href.substr(0, 4) !== 'tel:' &&
              href.substr(0, 4) !== 'ftp:' &&
              href.substr(0, 5) !== 'file:' &&
              href.substr(0, 5) !== 'http:' &&
              href.substr(0, 6) !== 'https:' &&
              href.substr(0, 7) !== 'mailto:'
            ) {
              checkLinkPath(0)
            }

            if (href && href.substr(0, 2) === '//') {
              href = href.substr(1)
            }
            jQuery(this).attr('href', href)
          })
          jQuery('img').each(function () {
            let src = jQuery(this).attr('src')
            let srcset = jQuery(this).attr('srcset')
            let dataOriginal = jQuery(this).attr('data-original')

            if (srcset !== undefined) {
              let img = srcset.substr(3)
              srcset = `/${img}`
            }

            if (src !== undefined && src.substr(0, 3) === '../') {
              src = dataOriginal = `/${src.substr(3)}`
            }

            jQuery(this).attr('src', src)
            jQuery(this).attr('srcset', srcset)
            jQuery(this).attr('data-original', dataOriginal)
          })
          jQuery('source').each(function () {
            let srcset = jQuery(this).attr('srcset')
            let dataSrcset = jQuery(this).attr('data-srcset')
            let src = jQuery(this).attr('src')

            if (src !== undefined) {
              src = `/${src.substr(3)}`
            }

            if (srcset !== undefined) {
              if (srcset.indexOf(',') !== -1) {
                const img = srcset.substring(2, srcset.lastIndexOf(','))
                const img2 = srcset
                  .substring(srcset.lastIndexOf('../') + 2)
                  .trim()
                srcset = dataSrcset = `${img}, ${img2}`
              }
            }

            jQuery(this).attr('data-srcset', dataSrcset)
            jQuery(this).attr('srcset', srcset)
            jQuery(this).attr('src', src)
          })
          jQuery('use').each(function () {
            let xlink = jQuery(this).attr('xlink:href')

            if (xlink.substr(0, 3) === '../') {
              xlink = xlink.substr(2)
            }

            jQuery(this).attr('xlink:href', xlink)
          })
        },
        parserOptions: {
          decodeEntities: false,
        },
      })
    )
    .pipe($.gulp.dest(`${$.conf.outputPath}/`))
    .pipe($.server.reload({ stream: true }))
}
