import { Observer } from '@core/observer'

export class ResizeObserver extends Observer {
  constructor() {
    super()

    this.observeResize()
  }

  observeResize() {
    window.addEventListener('resize', () => {
      if (!this.listeners.length) return false
      this.listeners.forEach((fn) => fn())
    })
  }
}
export const resizeObserver = new ResizeObserver();
export const onResize = (fn) => resizeObserver.subscribe(fn)
export const offResize = (fn) => resizeObserver.unsubscribe(fn)

// window.onResize = (fn) => resizeObserver.subscribe(fn);
// window.offResize = (fn) => resizeObserver.unsubscribe(fn);
