import { Widget } from '@core/widget'
import { IAccordOptions } from '@modules/accordion/accordion.interface'
import polyfill from '@core/polyfills'
import { startUikitScrollTo } from '@app/uikit/uikit-scroll-to'

const widgetInstances = new Map()

export class UikitAccord extends Widget {
  private $toggle: any
  private readonly $body: any
  private opened: boolean
  private busy: boolean
  private readonly eventHandlers: {}

  constructor(item, options?: IAccordOptions) {
    super(item, 'js-uikit-accord')

    this.$toggle = options.toggleElement ? options.toggleElement : this.queryElement('.toggle')
    this.$body = options.bodyElement ? options.bodyElement : this.queryElement('.body')

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
    startUikitScrollTo(this.$node)
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

  static init(elem, options = {}) {
    if (widgetInstances.has(elem) === false) {
      widgetInstances.set(elem, new UikitAccord(elem, options))
    }

    widgetInstances.get(elem).build()

    return widgetInstances.get(elem)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-uikit-accord').forEach((element) => {
    UikitAccord.init(element)
  })
})

// window.UikitAccord = UikitAccord
