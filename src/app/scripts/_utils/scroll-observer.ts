import { Observer } from '@core/observer'
import polyfill from '@core/polyfills'

class ScrollObserver extends Observer {
  ticking: boolean

  constructor() {
    super()

    this.ticking = false
    this.observeScroll()
  }

  observeScroll() {
    document.addEventListener(
      'scroll',
      () => {
        if (this.ticking) return null
        this.ticking = true
        polyfill.raf(() => {
          this.listeners.forEach((fn) => fn())
          this.ticking = false
        })
      },
      polyfill.passiveIfSupported
    )
  }
}

export const scrollObserver = new ScrollObserver()
export const onScroll = (fn) => scrollObserver.subscribe(fn)
export const offScroll = (fn) => scrollObserver.unsubscribe(fn)
// window.onScroll = (fn) => scrollObserver.subscribe(fn)
// window.offScroll = (fn) => scrollObserver.unsubscribe(fn)
