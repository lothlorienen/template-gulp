import { Preloader } from '@app/_utils/preloader'
import manager from '@widgets/popups'

class App {
  constructor() {
    this.addEvents()
  }

  addEvents() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initLibs()
      this.initModules()
    })
    document.documentElement.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) e.preventDefault()
    })
  }

  initLibs() {
    // window.svg4everybody();
  }

  initModules() {
    Preloader.disablingPreloader()
    manager.init()
  }
}

new App()
