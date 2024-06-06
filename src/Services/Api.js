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
    timeout: 600000,
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

Api.delete = async (url, data) => {
  try {
    return await client.delete(url, {}, { data })
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

Api.upload = async (url, file, ip) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('ip', ip)

    const response = await client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response
  } catch (err) {
    console.error('File upload failed:', err)
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

  return {
    success: matcher.ok && storage.ok && network.ok && authent.ok,
    matcher: matcher.ok,
    storage: storage.ok,
    network: network.ok,
    authent: authent.ok
  }
}

export default Api
