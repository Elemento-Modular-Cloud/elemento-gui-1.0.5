const express = require('express')
const cors = require('cors')
const apisauce = require('apisauce')
const { spawnSync } = require('child_process')
const path = require('path')

const API_PORT = 3456
const API_BASE_ADDR = 'http://10.164.0.3'
const API_URL_MATCHER = `${API_BASE_ADDR}:17777/`
const API_URL_STORAGE = `${API_BASE_ADDR}:27777/`
const API_URL_NETWORK = `${API_BASE_ADDR}:37777/`
const API_URL_AUTHENT = `${API_BASE_ADDR}:47777/`

const app = express()
app.use(cors({ origin: '*' }))

async function checkServicesTest () {
  const client = apisauce.create({
    timeout: 1000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const out1 = await client.get('http://localhost:8080')
  return out1.ok
}

async function checkServices () {
  const client = apisauce.create({
    timeout: 1000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const out1 = await client.get(API_URL_MATCHER)
  const out2 = await client.get(API_URL_STORAGE)
  const out3 = await client.get(API_URL_NETWORK)
  const out4 = await client.get(API_URL_AUTHENT)
  return out1.ok && out2.ok && out3.ok && out4.ok
}

app.get('/services/installed', async (req, res) => {
  const outcome = await checkServices()

  if (outcome) {
    res.send({
      servicesInstalled: true
    })
  } else {
    res.send({
      servicesInstalled: false
    })
  }
})

app.get('/services/requirements', async (req, res) => {
  const procNode = spawnSync('node', ['-v'])
  const procDocker = spawnSync('docker', ['ps'])

  if (procNode.error || procDocker.error) {
    res.send({
      requirementsInstalled: false
    })
  } else {
    const stdoutNode = procNode.stdout.toString()
    const stderrNode = procNode.stderr.toString()
    const stdoutDocker = procDocker.stdout.toString()
    const stderrDocker = procDocker.stderr.toString()

    if (
      stdoutNode && stdoutDocker &&
      (!stderrNode || stderrNode === '') &&
      (!stderrDocker || stderrDocker === '')
    ) {
      res.send({
        requirementsInstalled: true
      })
    } else {
      res.send({
        requirementsInstalled: false
      })
    }
  }
})

app.get('/services/install', async (req, res) => {
  await spawnSync('docker-compose', ['-f', path.join(__dirname, 'docker', 'docker-compose.yml'), 'up', '-d'])
  const outcome = await checkServicesTest()

  if (outcome) {
    console.log('services installed')
    res.send({
      servicesInstalled: true
    })
  } else {
    console.log('services not installed')
    res.send({
      servicesInstalled: false
    })
  }
})

app.listen(API_PORT, () => {
  console.log(`Server started on port ${API_PORT}`)
})
