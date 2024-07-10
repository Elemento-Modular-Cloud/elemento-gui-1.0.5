import React, { Component } from 'reactn'
import { Back, Daemons, Loader, Sidebar } from '../../Components'
import { ReactComponent as Save } from '../../Assets/utils/checkgreen.svg'
import { ReactComponent as Error } from '../../Assets/utils/checkred.svg'
import './Settings.css'
import swal from 'sweetalert'

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

const validateIPv4 = (ip) => {
  return ipv4Regex.test(ip)
}

class Settings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      useTCPList: false,
      useDiscovery: false,
      timeout: 0.1,
      ipv4List: [''],
      sshKey: ''
    }
  }

  componentDidMount () {
    try {
      window.require('electron').ipcRenderer.send('get-settings')

      window.require('electron').ipcRenderer.on('settings-data', async (event, arg) => {
        if (arg) {
          const { useTCPList, useDiscovery, timeout, ipv4List, sshKey } = arg
          const _ipv4List = ipv4List.map(ip => ip !== '' && ip)

          this.setState({
            useTCPList: useTCPList || false,
            useDiscovery: useDiscovery || false,
            timeout: timeout || 0.1,
            ipv4List: _ipv4List.length > 0 ? _ipv4List : [''],
            sshKey: sshKey || ''
          })
        }
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  async saveSettingsLocally (payload) {
    window.require('electron').ipcRenderer.send('save-settings', payload)

    swal('Success!', 'The settings have been successfully saved under ~/.elemento/settings', 'success', {
      buttons: false,
      timer: 3000
    })
  }

  async saveHostsLocally (payload) {
    window.require('electron').ipcRenderer.send('save-hosts', payload)

    swal('Success!', 'The IPv4 addresses have been successfully saved under ~/.elemento/hosts', 'success', {
      buttons: false,
      timer: 3000
    })
  }

  async updateSettings (data) {
    this.setState({ ...data })
  }

  async saveSettings () {
    const { useTCPList, useDiscovery, timeout, ipv4List, sshKey } = this.state

    if (!ipv4List) {
      swal('Error', 'IPv4 addresses list is empty', 'error', {
        buttons: false,
        timer: 2500
      })
    }

    for (const ip of ipv4List) {
      if (!validateIPv4(ip)) {
        swal('Error', 'One or more IPv4 addresses are not in the correct format (eg. 192.168.1.1)', 'error', {
          buttons: false,
          timer: 2500
        })
      }
    }

    await this.saveSettingsLocally({ useTCPList, useDiscovery, timeout, sshKey })
    await this.saveHostsLocally(ipv4List)
  }

  render () {
    const { loading, useTCPList, useDiscovery, timeout, ipv4List } = this.state

    return (
      <div className='licpage'>
        <Sidebar selected='settings' />
        <div className='lbody licbody'>
          <hr />

          <div className='settheader'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <span>Settings</span>
              {loading && <Loader />}
            </div>

            <div className='settlateral'>
              <div className='resumebtn' onClick={async () => await this.saveSettings()}>
                <Save />
                Save
              </div>

              <Back page='/' />
            </div>
          </div>

          <div className='settbody'>
            <div className='form-container'>
              <div className='form-group'>
                <label>Use TCP List:</label>
                <input
                  type='checkbox'
                  checked={useTCPList}
                  onChange={(e) => this.setState({ useTCPList: e.target.checked })}
                />
              </div>
              <div className='form-group'>
                <label>Use Discovery:</label>
                <input
                  type='checkbox'
                  checked={useDiscovery}
                  onChange={(e) => this.setState({ useDiscovery: e.target.checked })}
                />
              </div>
              <div className='form-group'>
                <label>Timeout:</label>
                <input
                  type='number'
                  step='0.1'
                  min='0.1'
                  value={timeout}
                  style={{ width: 50 }}
                  onChange={(e) => this.setState({ timeout: parseFloat(e.target.value) })}
                />
              </div>
              <div className='form-group'>
                <label>IPv4 Addresses:</label>
                <div className='addrlist'>
                  {ipv4List.map((ipv4, index) => {
                    return (
                      <div key={index} className='ipv4-input-group'>
                        {(!ipv4 || !validateIPv4(ipv4)) ? <Error style={{ width: 25, height: 25, marginRight: 10 }} /> : <span style={{ width: 25, height: 25, marginRight: 10 }} />}
                        <input
                          type='text'
                          value={ipv4}
                          onChange={(e) => {
                            const updatedList = [...ipv4List]
                            updatedList[index] = e.target.value
                            this.setState({ ipv4List: updatedList })
                          }}
                          placeholder='Enter IPv4 address'
                        />
                        <button type='button' onClick={() => this.setState({ ipv4List: [...ipv4List, ''] })} className='add-button'>+</button>
                        <button
                          type='button'
                          onClick={() => {
                            const updatedList = ipv4List.filter((_, i) => i !== index)
                            this.setState({ ipv4List: updatedList })
                          }}
                          className='delete-button'
                        >
                          -
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className='filebox'>
            <span>Please add your public SSH key to be sent to the virtual machine during its creation.</span>
            <textarea className='filearea' rows={20} cols={100} onChange={(e) => this.setState({ sshKey: e.target.value })} />
          </div>
        </div>

        <Daemons />
      </div>
    )
  }
}

export default Settings
