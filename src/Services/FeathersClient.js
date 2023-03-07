// import { getGlobal, setGlobal } from 'reactn'
import io from 'socket.io-client'
import feathers from '@feathersjs/client'
import socketio from '@feathersjs/socketio-client'
// import { persistState } from './GlobalState'
import Config from '../Global/Config'

const DEVELOP = true

const FC = {
  authenticated: false,
  socketConfig: {
    timeout: 10000,
    pingInterval: 10000,
    pingTimeout: 50000
  },
  socket: io(Config.API_BASE_URL),
  client: feathers()
}

FC.client.configure(socketio(FC.socket, FC.socketConfig))
FC.client.configure(feathers.authentication({ storage: window.localStorage }))

if (FC.authenticated) {
  FC.socket.on('connect', a => DEVELOP && console.log('Socket connected'))
  FC.socket.on('disconnect', a => DEVELOP && console.log('Socket disconnect'))
}

FC.authenticate = async jwt => {
  DEVELOP && console.log('Socket Auth. Called')
  try {
    await FC.client.authenticate({ strategy: 'jwt', accessToken: jwt })
    FC.authenticated = true
    // FC.client.service('SERVICE').on('created', eventHandler)
    return jwt
  } catch (e) {
    DEVELOP && console.log('Socket Authentication Failed!', e)
  }
  return false
}

FC.login = async (email, password) => {
  let result = {}
  try {
    result = await FC.client.authenticate({ strategy: 'local', email, password })
  } catch (e) {
    DEVELOP && console.log('Login Failed!', e)
  }
  return result.accessToken ? FC.authenticate(result.accessToken) : false
}

// const eventHandler = async event => {}

export default FC
