import apisauce from 'apisauce'
import LocalStorage from './LocalStorage'
import { Config } from '../Global'

const Api = {}
const storage = LocalStorage.get(Config.STORAGE_KEY)
if (storage !== null) { Api.jwt = storage.jwt || null }

let client = null

Api.createClient = (baseURL) => {
  client = apisauce.create({
    baseURL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: Api.jwt
    }
  })
}

Api.wait = ms => new Promise(resolve => setTimeout(resolve, ms))

Api.get = async (url, params) => {
  try {
    return await client.get(url, params)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.patch = async (url, data) => {
  try {
    return await client.patch(url, data)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.delete = async (url) => {
  try {
    return await client.delete(url)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.post = async (url, data) => {
  try {
    return await client.post(url, data)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.put = async (url, data) => {
  try {
    return await client.put(url, data)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.postData = async (url, data) => {
  try {
    return await client.post(url, data)
  } catch (err) {
    return { ok: false, error: err }
  }
}

Api.setJWT = jwt => {
  Api.jwt = `Bearer ${jwt}`
}

Api.upload = async file => {
  try {
    const files = new FormData()
    files.append('image', file)
    const response = await client.post('/upload', files)
    return response
  } catch (err) {
    return false
  }
}

Api.servicesStatus = async () => {
  Api.createClient(Config.API_URL_MATCHER_MAIN)
  const matcher = await client.get('/')
  Api.createClient(Config.API_URL_STORAGE_MAIN)
  const storage = await client.get('/')
  Api.createClient(Config.API_URL_NETWORK_MAIN)
  const network = await client.get('/')
  Api.createClient(Config.API_URL_AUTHENT_MAIN)
  const authent = await client.get('/')

  return matcher.ok && storage.ok && network.ok && authent.ok
}

export default Api
