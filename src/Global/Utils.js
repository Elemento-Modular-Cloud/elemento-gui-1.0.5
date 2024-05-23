import md5 from 'md5'

function formatBytes (bytes, decimals = 0) {
  if (!+bytes) return '0 Bytes'

  const k = 1000
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function toRGB (s) {
  let hash = 0
  if (s.length === 0) return hash
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }
  const rgb = [0, 0, 0]
  for (let j = 0; j < 3; j++) {
    rgb[j] = (hash >> (j * 8)) & 255
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

// function random (min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min)
// }

function compactString (s, size) {
  return md5(s || 'Elemento').substring(4, 8)
}

const Utils = {
  formatBytes,
  toRGB,
  compactString
}

export default Utils
