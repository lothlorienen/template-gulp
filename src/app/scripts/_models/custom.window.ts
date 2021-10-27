export interface IWindow extends Window {
  performance: any
  endEvents?: any
  createEvent?: any
  passiveIfSupported?: any
  CustomEvent?: any
  raf?: any
  raf2x?: any
  mozRequestAnimationFrame?: number
  msRequestAnimationFrame?: number
  isIE?: any
}
