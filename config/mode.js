export const setMode = (isProduction = false) => {
  return cb => {
    process.env.NODE_ENV = isProduction ? 'production' : 'development'
    $.conf.buildMode = isProduction ? 'prod' : 'dev'
    $.conf.outputPath = isProduction ? $.conf.prod : $.conf.dev
    cb()
  }
}
