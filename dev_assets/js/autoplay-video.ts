export class AutoplayVideo {
  constructor() {}

  static onObserve(entries) {
    entries.forEach(({ intersectionRatio, target }) => {
      if (intersectionRatio > 0) target.play()
      else target.pause()
    })
  }

  static playAutoplay(container, action) {
    const videos = container.querySelectorAll('video[autoplay]')
    switch (action) {
      case 'play':
        videos.forEach((item) => item.play())
        break
      case 'pause':
        videos.forEach((item) => item.pause())
        break
    }
  }

  static init() {
    let observer = null
    const config = {
      root: null,
      threshold: 0,
    }

    const videos = document.querySelectorAll('video[autoplay]')
    if (!videos.length) return false

    observer = new IntersectionObserver(AutoplayVideo.onObserve, config)
    videos.forEach((video) => {
      observer.observe(video)
    })
  }
}

// const autoplayVideo = AutoplayVideo.createInstance();
// window.initAutoplayVideo = autoplayVideo.init.bind(autoplayVideo);
// window.playAutoplay = AutoplayVideo.playAutoplay;
