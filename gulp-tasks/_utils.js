function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const round = (source, n) => {
  const places = Math.pow(10, n)
  return Math.round(source * places) / places
}

const logStylesSize = (details) =>
  console.log(
    `${details.name}: ${formatBytes(details.stats.originalSize)} --> ${formatBytes(
      details.stats.minifiedSize
    )} by ${round(details.stats.efficiency * 100, 3)}%`
  )

exports.logStyles = logStylesSize
