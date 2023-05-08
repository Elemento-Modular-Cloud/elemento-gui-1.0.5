import React, { Component } from 'reactn'
import { Api } from '../../Services'
import { Config } from '../../Global'
import { Back, Sidebar } from '../../Components'
import './Licences.css'
import swal from 'sweetalert'

class Licences extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      lock: false,
      licenses: []
    }
  }

  async componentDidMount () {
    await this.refreshData()
  }

  async refreshData () {
    this.setState({ loading: true, lock: true })

    Api.createClient(Config.API_URL_AUTHENT)
    const res = await Api.get('/license/list')

    if (res.ok) {
      this.setState({ licenses: res.data.licenses })
    }
    this.setState({ loading: false, lock: false })
  }

  async armLicense (licenseKey) {
    Api.createClient(Config.API_URL_AUTHENT)
    const res = await Api.post('/license/arm', {
      license_key: licenseKey
    })

    if (res.ok) {
      swal('Success!', 'Licese armed successfully', 'success', {
        buttons: false,
        timer: 3000
      })
      await this.refreshData()
    } else {
      swal('Error', 'Could not arm the selected license', 'error', {
        buttons: false,
        timer: 3000
      })
    }
  }

  async deleteLicense (licenseKey) {
    Api.createClient(Config.API_URL_AUTHENT)
    const res = await Api.delete('/license/delete', {
      license_key: licenseKey
    })

    if (res.ok) {
      swal('Success!', 'License deleted successfully', 'success', {
        buttons: false,
        timer: 3000
      })
      await this.refreshData()
    } else {
      swal('Error', 'Could not delete the selected license', 'error', {
        buttons: false,
        timer: 3000
      })
    }
  }

  render () {
    const { loading, licenses, lock } = this.state

    return (
      <div className='licpage'>
        <Sidebar selected='licences' />
        <div className='licbody'>
          <hr />

          <div className='licheader'>
            <span>Licences</span>
            <Back page='/' />
          </div>

          <div className='lictables'>
            <table className='lictable'>
              <thead className='lictablehead'>
                <tr>
                  <td>License Key</td>
                  <td>Duration</td>
                  <td>Activated</td>
                  <td>Expire Date</td>
                  <td>Expire</td>
                  <td>Activate License</td>
                  <td>Delete License</td>
                </tr>
              </thead>
              {
                !loading &&
                  <tbody className='lictablebody'>
                    {
                      licenses && licenses.length > 0 && licenses.map((license, i) => {
                        return (
                          <tr key={i}>
                            <td>{license.license_key}</td>
                            <td>{license.duration}</td>
                            <td>
                              <div className='licarmed' style={{ backgroundColor: license.is_armed ? 'rgba(80 , 160, 80)' : 'rgba(200, 68, 75)' }}>
                                <span>{license.is_armed ? 'ACTIVATED' : 'NOT ARMED'}</span>
                              </div>
                            </td>
                            <td>{license.expire_date}</td>
                            <td>{license.expire === null ? 'N/A' : new Date(license.expire * 1000).toDateString()}</td>
                            <td>
                              <button className='bn632-hover bn22' disabled={license.is_armed || lock} onClick={async () => await this.armLicense(license.license_key)}>Activate</button>
                            </td>
                            <td>
                              <button className='bn632-hover bn28' disabled={lock} onClick={async () => await this.deleteLicense(license.license_key)}>Delete</button>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
              }
            </table>
            {loading && <div className='loaderbox'><span className='loader' /></div>}
          </div>
        </div>
      </div>
    )
  }
}

export default Licences
