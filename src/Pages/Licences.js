import React, { Component } from 'react'
import { Api } from '../Services'
import { Config } from '../Global'

class Licences extends Component {
  constructor (props) {
    super(props)
    this.state = {
      licenses: []
    }
  }

  async componentDidMount () {
    Api.createClient(Config.API_URL_AUTHENT)
    const res = await Api.get('/license/list')

    if (res.ok) {
      this.setState({ licenses: res.data.licenses })
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

  async deleteLicense (licenseKey) {
    Api.createClient(Config.API_URL_AUTHENT)
    const res = await Api.post('/license/delete', {
      license_key: licenseKey
    })

    if (res.ok) {
      window.alert('Licese deleted successfully')
    } else {
      window.alert('Could not delete the selected license')
    }
  }

  render () {
    const { licenses } = this.state
    const { page, body } = styles

    return (
      <div style={page}>
        <div style={body}>
          <a href='/'>Back</a>
          <h1>Licences</h1>
          <table>
            <thead>
              <tr>
                <td>License Key</td>
                <td>Duration</td>
                <td>Is Armed</td>
                <td>Expire Date</td>
                <td>Expire</td>
                <td>Arm License</td>
                <td>Delete License</td>
              </tr>
            </thead>
            <tbody>
              {
                licenses && licenses.length > 0 && licenses.map((license, i) => {
                  return (
                    <tr key={i}>
                      <td>{license.license_key}</td>
                      <td>{license.duration}</td>
                      <td>{license.is_armed}</td>
                      <td>{license.expire_date}</td>
                      <td>{license.expire}</td>
                      <td>
                        <button onClick={async () => await this.armLicense(license.license_key)}>Arm</button>
                      </td>
                      <td>
                        <button onClick={async () => await this.deleteLicense(license.license_key)}>Delete</button>
                      </td>
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

export default Licences
