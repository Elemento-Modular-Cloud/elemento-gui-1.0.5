const API_BASE_ADDR = 'http://127.0.0.1'
// const API_BASE_ADDR = 'http://10.164.0.3'

const Config = {
  API_INTERNALSVC: 'http://localhost:3456/',
  API_URL_MATCHER: `${API_BASE_ADDR}:17777/api/v1.0/client/vm`,
  API_URL_STORAGE: `${API_BASE_ADDR}:27777/api/v1.0/client/volume`,
  API_URL_NETWORK: `${API_BASE_ADDR}:37777/api/v1.0/client/network`,
  API_URL_AUTHENT: `${API_BASE_ADDR}:47777/api/v1/authenticate`,
  STORAGE_KEY: 'ELEMENTO',
  // logo: require('../Assets/logo.png'),
  appVersion: '0.0.1'
}

export default Config
