const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const apisauce = require('apisauce')

const API_PORT = 3456
const API_BASE_ADDR = 'http://10.164.0.3'
const API_URL_MATCHER = `${API_BASE_ADDR}:17777/`
const API_URL_STORAGE = `${API_BASE_ADDR}:27777/`
const API_URL_NETWORK = `${API_BASE_ADDR}:37777/`
const API_URL_AUTHENT = `${API_BASE_ADDR}:47777/`

const app = express()
const server = http.createServer(app)
const io = socketIo(server, { cors: { origin: '*' } })

app.use(cors({ origin: '*' }))

app.get('/services', async (req, res) => {
  const client = apisauce.create({
    timeout: 1000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const matcher = await client.get(API_URL_MATCHER)
  const storage = await client.get(API_URL_STORAGE)
  const network = await client.get(API_URL_NETWORK)
  const authent = await client.get(API_URL_AUTHENT)

  res.send({
    matcher: matcher.ok,
    storage: storage.ok,
    network: network.ok,
    authent: authent.ok
  })
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.get('/download', async (req, res) => {
  const fs = require('fs')
  const https = require('https')
  const url = 'https://repo.elemento.cloud/app/Elemento_daemons.dmg'
  const filepath = '/Users/francescochiapello/Downloads/Elemento_daemons.dmg'

  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      return `Failed to download file: HTTP status code ${response.statusCode}`
    }

    const totalSize = parseInt(response.headers['content-length'], 10)
    io.emit('total', {
      totalSize
    })

    const file = fs.createWriteStream(filepath)
    response.pipe(file)

    let chunks = 0

    response.on('data', (chunk) => {
      chunks += chunk.length
      io.emit('chunk', {
        chunk: Math.round((chunks / totalSize) * 100)
      })
    })

    file.on('finish', () => {
      file.close()
      return filepath
    })

    file.on('error', (err) => {
      console.error('File error:', err)
      return err
    })

    response.on('error', (err) => {
      console.error('Response error:', err)
      return err
    })
  }).on('error', (err) => {
    console.error('Request error:', err)
    return err
  })
})

server.listen(API_PORT, () => {
  console.log(`Server started on port ${API_PORT}`)
})
