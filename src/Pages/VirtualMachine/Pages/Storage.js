import React, { Component } from 'reactn'
import { Api, persistState } from '../../../Services'
import { Config } from '../../../Global'

class Storage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      storages: [],
      storage: null,
      volumeIds: []
    }
  }

  async componentDidMount () {
    await this.getAccessibleStorages()
  }

  async getAccessibleStorages () {
    Api.createClient(Config.API_URL_STORAGE)
    const res = await Api.get('/accessible')

    if (res.ok) {
      this.setState({ storages: res.data })
    } else {
      window.alert('Could not retrieve accessible storages')
    }
  }

  async updateState (volumeID) {
    const { advancedSetup } = this.global
    const { storages } = this.state

    const storage = storages.filter(storage => storage.volumeID === volumeID)[0]
    const volumeIds = [{ vid: volumeID }]
    this.setState({ storage, volumeIds })

    this.props.setVolumeIds({ volumeIds })
    await this.setGlobal({
      advancedSetup: {
        ...advancedSetup,
        volumeIds
      }
    }, persistState)
  }

  render () {
    const { storages, storage } = this.state

    return (
      <div>
        <h2>Storage setup</h2>

        <select onChange={async e => await this.updateState(e.target.value)}>
          <option>...</option>
          {
            storages && storages.length > 0 && storages.map((storage, i) =>
              <option key={i} value={storage.volumeID}>{storage.name}</option>
            )
          }
        </select>

        {
          storage &&
            <div>
              <table>
                <thead>
                  <tr>
                    <td>Bootable</td>
                    <td>Name</td>
                    <td>Private</td>
                    <td>Read Only</td>
                    <td>Shareable</td>
                    <td>Size</td>
                    <td>Volume ID</td>
                    <td>Server URL</td>
                    <td>Server</td>
                    <td>Own</td>
                    <td>Servers N.</td>
                    <td>Servers</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{storage.bootable ? 'Yes' : 'No'}</td>
                    <td>{storage.name}</td>
                    <td>{storage.private ? 'Yes' : 'No'}</td>
                    <td>{storage.readonly ? 'Yes' : 'No'}</td>
                    <td>{storage.shareable ? 'Yes' : 'No'}</td>
                    <td>{storage.size}</td>
                    <td>{storage.volumeID}</td>
                    <td>{storage.serverurl}</td>
                    <td>{storage.server}</td>
                    <td>{storage.own ? 'Yes' : 'No'}</td>
                    <td>{storage.nservers}</td>
                    <td>{storage.servers}</td>
                  </tr>
                </tbody>
              </table>
            </div>
        }
      </div>
    )
  }
}

export default Storage
