import { getScrollPos } from './/scroll-control'
import polyfill from '@core/polyfills'

export class ScrollTo {
  static startAnimation(targetElem: HTMLElement, noAnimate: boolean) {
    const header = document.querySelector('.js-header')

    let targetPos = targetElem.getBoundingClientRect().top

    if (header) targetPos -= header.getBoundingClientRect().height

    if (noAnimate) {
      ScrollTo.respond(targetElem)
      return scrollTo(0, targetPos)
    }

    if ('scrollBehavior' in document.body.style) {
      ScrollTo.respond(targetElem)
      return scrollBy({
        top: targetPos,
        behavior: 'smooth',
      })
    }

    const duration = 1200
    const startPos = getScrollPos()
    const startTime = performance.now()

    polyfill.raf2x(animation)

    function animation(currentTime) {
      const elapsedTime = currentTime - startTime
      const nextStep = ScrollTo.timingFunction(elapsedTime, startPos, targetPos, duration)

      scrollTo(0, nextStep)

      if (elapsedTime < duration) polyfill.raf(animation)
      else ScrollTo.respond(targetElem)
    }
  }

  static timingFunction(t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b
    return (c / 2) * ((t -= 2) * t * t + 2) + b
  }

  static respond(targetElem) {
    const event = new CustomEvent('endScroll', {
      detail: { targetElem },
    })

    document.dispatchEvent(event)
  }
}

export const startScrollTo = ScrollTo.startAnimation
// window.startScrollTo = ScrollTo.startAnimation
