const LocalStorage = {
  get: (key) => {
    const value = window.localStorage.getItem(key)
    return value === null ? {} : JSON.parse(value)
  },
  set: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  clear: () => {
    window.localStorage.clear()
  },
  delete: (key) => {
    window.localStorage.removeItem(key)
  }
}

export default LocalStorage
