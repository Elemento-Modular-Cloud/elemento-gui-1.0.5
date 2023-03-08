import { setGlobal, resetGlobal } from 'reactn'
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import { LocalStorage } from '.'
import Api from './Api'
import { Config } from '../Global'

const DEFAULT_STATE = {
  loggedIn: false,
  username: '',
  password: ''
}
const DEFAULT_CONFIG = {}

const restoreState = async () => {
  const appStorage = await Promise.all([
    LocalStorage.get(Config.STORAGE_KEY),
    resetGlobal()
  ])
  await setGlobal({ ...DEFAULT_STATE, ...appStorage[0], config: { ...DEFAULT_CONFIG } }, persistState)

  const jwt = appStorage[0].jwt
  if (isJWTValid(jwt)) {
    // FC.authenticate(jwt)
    Api.setJWT(jwt)
  }
}

const persistState = async state => { LocalStorage.set(Config.STORAGE_KEY, state) }

const clearState = async () => {
  resetGlobal()
  LocalStorage.clear()
  await setGlobal(DEFAULT_STATE)
}

const isJWTValid = (jwt) => {
  try { return moment.unix(jwtDecode(jwt).exp) - moment() > 0 } catch (e) {}
  return false
}

export {
  restoreState,
  persistState,
  clearState
}
