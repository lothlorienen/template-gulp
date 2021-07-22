import { Widget } from '@core/widget'
import { startScrollTo } from '@utils/scroll-to'
import polyfill from '@app/polyfills'

const widgetInstances = new Map()

interface IAccordOptions {
  toggleElement?: boolean
  bodyElement?: boolean
}

export class Accord extends Widget {
  private $toggle: any
  private $body: any
  private opened: boolean
  private busy: boolean
  private eventHandlers: {}

  constructor(item, options?: IAccordOptions) {
    super(item, 'js-accord')

    this.$toggle = options.toggleElement
      ? options.toggleElement
      : this.queryElement('.toggle')
    this.$body = options.bodyElement
      ? options.bodyElement
      : this.queryElement('.body')

    this.opened = this.$node.classList.contains('opened')
    this.busy = false

    this.eventHandlers = {}

    this.onToggleClick = this.onToggleClick.bind(this)
  }

  build() {
    this.$toggle.addEventListener('click', this.onToggleClick)
  }

  destroy() {
    this.$toggle.removeEventListener('click', this.onToggleClick)
  }

  on(event, handler) {
    if (!(event in this.eventHandlers)) {
      this.eventHandlers[event] = []
    }
    this.eventHandlers[event].push(handler)
  }

  trigger(event) {
    if (event in this.eventHandlers) {
      this.eventHandlers[event].forEach((eventHandler) => eventHandler())
    }
  }

  scrollToView() {
    startScrollTo(this.$node, false)
  }

  open() {
    this.$node.classList.add('opened')
    this.expand()
    this.trigger('opening')

    setTimeout(() => this.scrollToView(), 300)
  }

  close() {
    this.collapse()
    this.$node.classList.remove('opened')
  }

  onToggleClick(e) {
    e.preventDefault()
    if (this.busy) return
    this.busy = true

    !this.$node.classList.contains('opened') ? this.open() : this.close()
  }

  collapse() {
    this.animate({
      from: this.$body.scrollHeight,
      to: 0,
    })
  }

  expand() {
    this.animate({
      from: 0,
      to: this.$body.scrollHeight,
    })
  }

  animate(height) {
    const elem = this.$body

    const handler = (e) => {
      if (e.target !== e.currentTarget) return false
      elem.removeEventListener(polyfill.endEvents.transition, handler)
      elem.classList.remove('animate')
      elem.style.height = ''
      this.busy = false
    }
    elem.addEventListener(polyfill.endEvents.transition, handler)

    elem.classList.add('animate')
    elem.style.height = `${height.from}px`
    polyfill.raf2x(() => {
      elem.style.height = `${height.to}px`
    })
  }

  static destroy(elem) {
    widgetInstances.get(elem).destroy()
  }

  static get(elem) {
    return widgetInstances.get(elem)
  }

  static init(elem, options = {}) {
    if (widgetInstances.has(elem) === false) {
      widgetInstances.set(elem, new Accord(elem, options))
    }

    widgetInstances.get(elem).build()

    return widgetInstances.get(elem)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-accord').forEach((element) => {
    Accord.init(element)
  })
})

// window.Accord = Accord
