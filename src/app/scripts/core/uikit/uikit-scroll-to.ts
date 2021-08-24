import { getScrollPos } from '@utils/scroll-control'
import polyfill from '@app/polyfills'

export class UikitScrollTo {
  static startAnimation(targetElem: HTMLElement, noAnimate: boolean = false) {
    let targetPos =
      targetElem.getBoundingClientRect().top -
      document.querySelector('.js-uikit-header').getBoundingClientRect().height

    if ('scrollBehavior' in document.body.style) {
      UikitScrollTo.respond(targetElem)
      return scrollBy({
        top: targetPos,
        behavior: 'smooth',
      })
    }

    const duration = 1200
    const startPos = getScrollPos()
    const startTime = performance.now()

    polyfill.raf(animation)

    function animation(currentTime) {
      const elapsedTime = currentTime - startTime
      const nextStep = UikitScrollTo.timingFunction(
        elapsedTime,
        startPos,
        targetPos,
        duration
      )

      scrollTo(0, nextStep)

      if (elapsedTime < duration) polyfill.raf(animation)
      else UikitScrollTo.respond(targetElem)
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

export const startUikitScrollTo = UikitScrollTo.startAnimation
// window.startUikitScrollTo = UikitScrollTo.startAnimation;
