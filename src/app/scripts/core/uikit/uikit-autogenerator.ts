import { startUikitScrollTo } from '@core/uikit/uikit-scroll-to'

export class Autogenerator {
  config: any
  insertAdjacentElement: HTMLElement

  constructor(element: any, options) {
    const defaults = {
      selector: 'js-autogenerator',
    }

    this.config = Object.assign({}, defaults, options)
    this.insertAdjacentElement = document.querySelector(
      `${this.config.selector}-append`
    )

    let html = ''
    element
      .querySelectorAll(`${this.config.selector}-title`)
      .forEach((title) => {
        const sectionElement = title.parentElement.parentElement

        html += `
        <li>
          <a class="uikit-aside__link" href="#" data-id="${sectionElement.id}">${title.textContent}</a>
      `

        const subtitles = sectionElement.querySelectorAll(
          `${this.config.selector}-subtitle`
        )

        if (subtitles.length) {
          html += `<ul>`

          subtitles.forEach((subtitle) => {
            html += `
            <li>
              <a class="uikit-aside__sublink" href="#" data-id="${subtitle.parentElement.id}">${subtitle.textContent}</a>
            </li>
          `
          })

          html += `</ul>`
        }

        html += `</li>`
      })

    this.insertAdjacentElement.insertAdjacentHTML('beforeend', html)
  }

  static init(element, options) {
    element && new Autogenerator(element, options)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const selector = '.js-uikit-autogenerator'
  document
    .querySelectorAll(selector)
    .forEach((element) => Autogenerator.init(element, { selector }))

  document
    .querySelectorAll('.uikit-aside__nav a[href="#"][data-id]')
    .forEach((item: HTMLElement) => {
      item.addEventListener('click', (e) => {
        e.preventDefault()

        const id = item.dataset.id
        const activeSection = document.getElementById(id)
        const accord = activeSection.closest('.js-uikit-accord')
        const accords = document.querySelectorAll('.js-uikit-accord')

        if (!accord.classList.contains('opened')) {
          accord.classList.add('opened')
        }

        startUikitScrollTo(document.querySelector(`#${id}`) as HTMLElement)

        if (!activeSection.classList.contains('uikit-subsection')) {
          accords.forEach((item) => {
            item.classList.add('inactive')
            setTimeout(() => {
              item.classList.remove('inactive')
            }, 2100)
          })

          accord.classList.remove('inactive')
          accord.classList.add('animate')

          setTimeout(() => {
            accord.classList.remove('animate')
          }, 2100)
        }
      })
    })
})
