interface IPolyfill extends Window {
  endEvents?: any
  createEvent?: any
  passiveIfSupported?: boolean | { passive: boolean }
  CustomEvent?: any | CustomEvent
  raf?: (callback: FrameRequestCallback) => number
  raf2x?: (callback: FrameRequestCallback) => number
  isIE?: boolean
}

const polyfill: IPolyfill = window

const pCollection = [
  function endEvents() {
    polyfill.endEvents = {
      transition: {
        transition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'mozTransitionEnd',
        OTransition: 'oTransitionEnd',
        msTransition: 'MSTransitionEnd',
      },
      animation: {
        animation: 'animationend',
        WebkitAnimation: 'webkitAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        OAnimation: 'oAnimationEnd',
        msAnimation: 'MSAnimationEnd',
      },
    }

    const elem = document.createElement('div')

    for (const endKey in polyfill.endEvents) {
      if (Object.prototype.hasOwnProperty.call(polyfill.endEvents, endKey)) {
        const endType = polyfill.endEvents[endKey]

        for (const event in endType) {
          if (event in elem.style && Object.prototype.hasOwnProperty.call(endType, event)) {
            polyfill.endEvents[endKey] = endType[event]
            break
          }
        }
      }
    }
  },
  function createEvent() {
    polyfill.createEvent = (eventType: string) => {
      let event: Event = null

      if (typeof Event === 'function') {
        event = new Event(eventType)
      } else {
        event = document.createEvent('Event')
        event.initEvent(eventType, true, true)
      }

      return event
    }
  },
  function passiveEvent() {
    polyfill.passiveIfSupported = null

    try {
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: () => (polyfill.passiveIfSupported = { passive: true }),
        })
      )
    } catch (err) {
      polyfill.passiveIfSupported = false
    }
  },
  function customEvent() {
    if (typeof window.CustomEvent !== 'function') {
      const CustomEvent = (event, params) => {
        const evt = document.createEvent('CustomEvent')

        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined,
        }
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)

        return evt
      }

      CustomEvent.prototype = window.Event.prototype
      polyfill.CustomEvent = CustomEvent as any
    }
  },
  function raf() {
    let lastTime = 0
    const vendors = ['ms', 'moz', 'webkit', 'o']
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
      window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
    }

    polyfill.raf = window.requestAnimationFrame

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function (callback) {
        const currTime = new Date().getTime()
        const timeToCall = Math.max(0, 16 - (currTime - lastTime))
        const id = window.setTimeout(function () {
          callback(currTime + timeToCall)
        }, timeToCall)
        lastTime = currTime + timeToCall
        return id
      }

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id)
      }
  },
  function raf2x() {
    polyfill.raf2x = (callback: FrameRequestCallback) => polyfill.raf(() => polyfill.raf(callback))
  },
  function matches() {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.webkitMatchesSelector || (Element as any).prototype.msMatchesSelector
    }
  },
  function closest() {
    if (!Element.prototype.closest) {
      Element.prototype.closest =
        Element.prototype.closest ||
        function closest(selector) {
          if (!this) return null
          if (this.matches(selector)) return this
          if (!this.parentElement) {
            return null
          } else return this.parentElement.closest(selector)
        }
    }
  },
  function webpChecker() {
    const webp = new Image()
    ;['load', 'error'].forEach((eventName) => {
      webp.addEventListener(eventName, () => {
        webp.height === 2 && document.body.classList.add('webp')
      })
    })
    webp.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  },
  function ieChecker() {
    const agent = window.navigator.userAgent
    const isIE = /MSIE|Trident|Edge\//.test(agent)

    if (isIE) {
      polyfill.isIE = true
      document.body.classList.add('ie')
    } else {
      polyfill.isIE = false
    }
  },
  function dataset() {
    if (!document.body.dataset) {
      Object.defineProperty(HTMLElement.prototype, 'dataset', {
        get() {
          const attrs = this.attributes
          const dataAttrs = {}

          for (const attr in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, attr) && attrs[attr].name.search('data') === 0) {
              const attrName = attrs[attr].name.slice(5)
              const propName = attrName.replace(/-\w/gi, (str) => {
                return str.slice(1).toUpperCase()
              })

              Object.defineProperty(dataAttrs, propName, {
                get() {
                  return this.getAttribute(`data-${attrName}`)
                },
                set(newValue) {
                  this.setAttribute(`data-${attrName}`, newValue)
                },
              })
            }
          }

          return dataAttrs
        },
      })
    }
  },
]

pCollection.forEach((item) => item())

export default polyfill
