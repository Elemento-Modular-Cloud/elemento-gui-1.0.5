import React, { Component } from 'reactn'
import { Api, persistState } from '../../../Services'
import { Config } from '../../../Global'

class Storage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      storages: [],
      storage: null,
      volumeIds: [],
      storagesIds: [],
      storageSelected: null,
      storagesSelected: []
    }
  }

  async componentDidMount () {
    const storages = await this.getAccessibleStorages()

    const { advancedSetup: { volumeIds } } = this.global
    const storagesSelected = []
    volumeIds.forEach(volume => {
      storagesSelected.push(storages.filter(storage => storage.volumeID === volume.vid)[0])
    })

    this.setState({
      storagesIds: volumeIds,
      storagesSelected
    })
  }

  async getAccessibleStorages () {
    Api.createClient(Config.API_URL_STORAGE)
    const res = await Api.get('/accessible')
    const storages = res.data

    if (res.ok) {
      this.setState({ storages })
      return storages
    } else {
      window.alert('Could not retrieve accessible storages')
      return []
    }
  }

  async updateState () {
    const { advancedSetup } = this.global
    const { storages, storagesIds, storageSelected, storagesSelected } = this.state

    const exists = storagesSelected.filter(storage => storage.volumeID === storageSelected).length > 0
    if (exists) {
      window.alert('This volume has already been added')
      return
    }

    const storage = storages.filter(storage => storage.volumeID === storageSelected)[0]
    const volumeIds = [...storagesIds, { vid: storageSelected }]
    const updatedStoragesSelected = [...storagesSelected, storage]

    this.setState({
      storage,
      volumeIds,
      storagesSelected: updatedStoragesSelected
    })

    this.props.setVolumeIds({ volumeIds })
    await this.setGlobal({
      advancedSetup: {
        ...advancedSetup,
        volumeIds
      }
    }, persistState)
  }

  render () {
    const { storages, storagesSelected } = this.state

    return (
      <div>
        <h2>Storage setup</h2>

        <select
          onChange={async e => {
            this.setState({ storageSelected: e.target.value })
          }}
        >
          <option>...</option>
          {
            storages && storages.length > 0 && storages.map((storage, i) =>
              <option key={i} value={storage.volumeID}>{storage.name}</option>
            )
          }
        </select>
        <br />
        <br />
        <button onClick={async () => await this.updateState()}>Add this volume</button>
        <br />
        <br />
        <div>
          <h2>Added volumes</h2>
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
              {
                storagesSelected && storagesSelected.length > 0 && storagesSelected.map((storage, i) => {
                  return (
                    <tr key={i}>
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

export default Storage
