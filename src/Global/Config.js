const API_BASE_ADDR = 'http://127.0.0.1'
// const API_BASE_ADDR = 'http://10.164.0.3'

const Config = {
  API_URL_MATCHER: `${API_BASE_ADDR}:17777/api/v1.0/client/vm`,
  API_URL_MATCHER_MAIN: `${API_BASE_ADDR}:17777/`,
  API_URL_STORAGE: `${API_BASE_ADDR}:27777/api/v1.0/client/volume`,
  API_URL_STORAGE_MAIN: `${API_BASE_ADDR}:27777/`,
  API_URL_NETWORK: `${API_BASE_ADDR}:37777/api/v1.0/client/network`,
  API_URL_NETWORK_MAIN: `${API_BASE_ADDR}:37777/`,
  API_URL_AUTHENT: `${API_BASE_ADDR}:47777/api/v1/authenticate`,
  API_URL_AUTHENT_MAIN: `${API_BASE_ADDR}:47777/`,
  STORAGE_KEY: 'ELEMENTO',
  appVersion: require('../../package.json').version
}

export default Config
