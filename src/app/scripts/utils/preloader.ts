import polyfill from "@app/polyfills";

export default class Preloader {
  static disablingPreloader() {
    const preloader: HTMLElement = document.querySelector('.js-preloader');
    const uikitPreloader: HTMLElement = document.querySelector('.js-uikit-preloader');

    preloader ?
      Preloader.handler(preloader) :
      uikitPreloader ? Preloader.handler(uikitPreloader) : null

    document.body.classList.add('loaded')
  }

  static handler(el: HTMLElement): void {
    const handler = e => {
      const { target, currentTarget } = e
      if (target !== currentTarget) return false
      el.removeEventListener(polyfill.endEvents.animation, handler)
      el.style.display = 'none'
      el.classList.remove('hide')

      setTimeout(() => {
        const pageEvent = new CustomEvent('pageLoaded');
        document.dispatchEvent(pageEvent);
      }, 1000);
    }
    setTimeout(() => {
      el.addEventListener(polyfill.endEvents.animation, handler)
      el.classList.add('hide')
    }, 500)
  }
}
