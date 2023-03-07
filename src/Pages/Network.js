import React, { Component } from 'react'
import { Api } from '../Services'
import { Config } from '../Global'

class Network extends Component {
  constructor (props) {
    super(props)
    this.state = {
      networks: []
    }
  }

  async componentDidMount () {
    Api.createClient(Config.API_URL_NETWORK)
    const res = await Api.post('/list')

    if (res.ok) {
      this.setState({ networks: res.data })
    }
  }

  async armLicense (licenseKey) {
    Api.createClient(Config.API_URL_AUTHENT)
    const res = await Api.post('/license/arm', {
      license_key: licenseKey
    })

    if (res.ok) {
      window.alert('Licese armed successfully')
    } else {
      window.alert('Could not arm the selected license')
    }
  }

  render () {
    const { networks } = this.state
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
