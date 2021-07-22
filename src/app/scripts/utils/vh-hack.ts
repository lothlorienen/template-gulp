import { onResize } from '@utils/resize-observer'

;(function () {
  const update = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  onResize(update)
  update()
})()

// Example using - `height: calc(var(--vh, 1vh) * 100 - 135px);` equal to height: `calc(100vh - 135px)`
