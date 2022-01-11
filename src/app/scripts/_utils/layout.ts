import { onResize } from './/resize-observer'

interface ILayout {
  mobile_width: number
  listeners: any[]
  is_mobile: null | boolean
  is_tablet: null | boolean
  is_laptop: null | boolean
  laptop_width: number
  tablet_width: number
  documentClickListeners: any[]
}

const layoutConfig: ILayout = {
  mobile_width: 767,
  tablet_width: 1023,
  laptop_width: 1279,
  listeners: [],
  documentClickListeners: [],
  is_mobile: null,
  is_tablet: null,
  is_laptop: null,
}

export class Layout {
  constructor() {
    this.resizeEvents = this.resizeEvents.bind(this)
    this.events()
  }

  events() {
    layoutConfig.is_mobile = Layout.isMobileLayout()

    onResize(this.resizeEvents)

    let documentClick = false

    document.addEventListener('touchstart', () => (documentClick = true))
    document.addEventListener('touchmove', () => (documentClick = false))
    document.addEventListener('click touchend', (e) => {
      if (e.type === 'click') documentClick = true
      if (documentClick) Layout.fireDocumentClick(e)
    })
  }

  resizeEvents() {
    const isMobile = Layout.isMobileLayout()
    const isTablet = Layout.isTabletLayout()
    const isLaptop = Layout.isLaptopLayout()

    if (isMobile !== layoutConfig.is_mobile) {
      layoutConfig.is_mobile = isMobile
      Layout.fireChangeMode()
    } else if (isTablet !== layoutConfig.is_tablet) {
      layoutConfig.is_tablet = isTablet
      Layout.fireChangeMode()
    } else if (isLaptop !== layoutConfig.is_laptop) {
      layoutConfig.is_laptop = isLaptop
      Layout.fireChangeMode()
    }
  }

  static addListener(func) {
    layoutConfig.listeners.push(func)
  }

  static fireChangeMode() {
    setTimeout(() => {
      for (let i = 0; i < layoutConfig.listeners.length; i++) {
        layoutConfig.listeners[i](layoutConfig.is_mobile)
      }
    }, 0)
  }

  static addDocumentClickHandler(handler) {
    layoutConfig.documentClickListeners.push(handler)
  }

  static fireDocumentClick(e) {
    layoutConfig.documentClickListeners.forEach((handler) => handler(e))
  }

  static isTouchDevice() {
    return 'ontouchstart' in document.documentElement
  }

  static isMobileLayout() {
    return window.innerWidth <= layoutConfig.mobile_width
  }

  static isTabletLayout() {
    return window.innerWidth <= layoutConfig.tablet_width
  }

  static isBigTabletLayout() {
    return window.innerWidth > layoutConfig.tablet_width && window.innerWidth <= layoutConfig.laptop_width
  }

  static isLaptopLayout() {
    return window.innerWidth <= layoutConfig.laptop_width
  }

  static isDesktopLayout() {
    return !Layout.isMobileLayout() && !Layout.isTabletLayout() && !Layout.isLaptopLayout()
  }

  static init() {
    return new Layout()
  }
}

export const isMobileLayout = () => Layout.isMobileLayout()
export const isTabletLayout = () => Layout.isTabletLayout()
export const isBigTabletLayout = () => Layout.isBigTabletLayout()
export const isLaptopLayout = () => Layout.isLaptopLayout()
export const isDesktopLayout = () => Layout.isDesktopLayout()

// window.Layout = Layout;
// window.isMobileLayout = () => Layout.isMobileLayout();
// window.isTabletLayout = () => Layout.isTabletLayout();
// window.isBigTabletLayout = () => Layout.isBigTabletLayout();
// window.isLaptopLayout = () => Layout.isLaptopLayout();
// window.isDesktopLayout = () => Layout.isDesktopLayout();
