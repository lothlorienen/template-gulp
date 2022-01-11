import { isMobileLayout } from './/layout'
import { onScroll } from './/scroll-observer'

class ScrollControl {
  private isFixedScroll: boolean
  private lastScrollPos: number

  constructor() {
    this.isFixedScroll = false
    this.lastScrollPos = this._getScrollPos()

    onScroll(() => {
      if (this.isFixedScroll) return false
      this.lastScrollPos = this._getScrollPos()
    })
  }

  _getScrollPos() {
    return window.pageYOffset
  }

  showScrollbar() {
    if (!document.body.classList.contains('fixed-scroll')) {
      return false
    }

    document.body.classList.remove('fixed-scroll')
    document.body.style.paddingRight = ``

    if (isMobileLayout()) {
      this.lastScrollPos = parseFloat(getComputedStyle(document.body).top || '0')
      document.body.style.top = ``
      window.scrollTo(0, this.lastScrollPos * -1)
    }

    this.isFixedScroll = false
    return true
  }

  hideScrollbar() {
    if (document.body.classList.contains('fixed-scroll')) {
      return false
    }

    if (isMobileLayout()) {
      document.body.style.top = `-${this.lastScrollPos}px`
    }

    document.body.classList.add('fixed-scroll')
    document.body.style.paddingRight = ScrollControl._calcScrollbarWidth()

    this.isFixedScroll = true
    return true
  }

  getScrollbarState() {
    return this.isFixedScroll
  }

  getLastScrollPos() {
    return this.lastScrollPos
  }

  static _calcScrollbarWidth() {
    const scrollbarMeasure = document.createElement('div')
    scrollbarMeasure.className = 'scroll-measure'

    document.body.appendChild(scrollbarMeasure)

    const offsetWidth = scrollbarMeasure.offsetWidth
    const clientWidth = scrollbarMeasure.clientWidth
    const scrollbarWidth = `${offsetWidth - clientWidth}px`

    document.body.removeChild(scrollbarMeasure)

    return scrollbarWidth
  }
}

export const scrollControl = new ScrollControl()
export const showScrollbar = scrollControl.showScrollbar.bind(scrollControl)
export const hideScrollbar = scrollControl.hideScrollbar.bind(scrollControl)
export const getScrollPos = scrollControl.getLastScrollPos.bind(scrollControl)
export const isFixedScroll = scrollControl.getScrollbarState.bind(scrollControl)

// window.showScrollbar = scrollControl.showScrollbar.bind(scrollControl)
// window.hideScrollbar = scrollControl.hideScrollbar.bind(scrollControl)
// window.getScrollPos = scrollControl.getLastScrollPos.bind(scrollControl)
// window.isFixedSCroll = scrollControl.getScrollbarState.bind(scrollControl)
