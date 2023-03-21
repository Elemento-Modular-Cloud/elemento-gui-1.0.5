import React, { Component } from 'react'
import { Api } from '../Services'
import { Config } from '../Global'

class Network extends Component {
  constructor (props) {
    super(props)
    this.state = {
      networks: [],
      ports: [],
      speed: ''
    }
  }

  async componentDidMount () {
    await this.getNetworkList()
  }

  async getNetworkList () {
    Api.createClient(Config.API_URL_NETWORK)
    const res = await Api.post('/list', {})

    if (res.ok) {
      this.setState({ networks: res.data })
    }
  }

  async createNewNetwork () {
    const { ports, speed } = this.state

    Api.createClient(Config.API_URL_NETWORK)
    const res = await Api.post('/create', {
      ports, speed
    })

    if (res.ok) {
      window.alert('Network added successfully')
      await this.getNetworkList()
    } else {
      window.alert('Could not add the network')
    }
  }

  render () {
    const { networks, ports, speed } = this.state
    const { page, body } = styles

    return (
      <div style={page}>
        <div style={body}>
          <a href='/'>Back</a>
          <h1>Network</h1>
          <table>
            <thead>
              <tr>
                <td>Creator Id</td>
                <td>Network Id</td>
                <td>Name</td>
                <td>Ports</td>
                <td>Hostname</td>
                <td>Overprovision</td>
                <td>Private</td>
                <td>Speed</td>
              </tr>
            </thead>
            <tbody>
              {
                networks && networks.length > 0 && networks.map((network, i) => {
                  return (
                    <tr key={i}>
                      <td>{network.creatorID}</td>
                      <td>{network.network_id}</td>
                      <td>{network.name}</td>
                      <td>{network.hostname}</td>
                      <td>{network.overprovision}</td>
                      <td>{network.private}</td>
                      <td>{network.speed}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>

          <h2>New network</h2>
          Port: {ports}
          <select onChange={e => this.setState({ ports: [e.target.value] })}>
            <option>...</option>
            <option value='80'>80</option>
            <option value='8080'>8080</option>
            <option value='3030'>3030</option>
            <option value='443'>443</option>
          </select>
          <br />
          Speed: {speed}
          <select onChange={e => this.setState({ speed: e.target.value })}>
            <option>...</option>
            <option value='10 Mbit/s'>10 Mbit/s</option>
            <option value='1 Gbit/s'>1 Gbit/s</option>
            <option value='2.5 Gbit/s'>2.5 Gbit/s</option>
            <option value='5 Gbit/s'>5 Gbit/s</option>
            <option value='10 Gbit/s'>10 Gbit/s</option>
            <option value='25 Gbit/s'>25 Gbit/s</option>
            <option value='100 Gbit/s'>100 Gbit/s</option>
          </select>
          <br />
          <button onClick={async () => await this.createNewNetwork()}>Create</button>
        </div>
      </div>
    )
  }
}

const styles = {
  page: {

  },
  body: {

  }
}

export default Network
