import React, { Component } from 'reactn'
import { Api, persistState } from '../../../Services'
import { Config, Utils } from '../../../Global'
import { CustomSelect } from '../../../Components'
import { ReactComponent as CheckGreen } from '../../../Assets/utils/checkgreen.svg'
import { ReactComponent as CheckRed } from '../../../Assets/utils/checkred.svg'
import '../css/Pages.css'

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
    volumeIds && volumeIds.length > 0 && volumeIds.forEach(volume => {
      storagesSelected.push(storages.filter(storage => storage.volumeID === volume.vid)[0])
    })

    this.setState({
      storagesIds: volumeIds || [],
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

  async updateState (storageSelected) {
    const { advancedSetup } = this.global
    const { storages, storagesIds, storagesSelected } = this.state

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

  async removeStorage (volumeID) {
    const { storagesSelected } = this.state
    const updated = [...storagesSelected.filter(s => s.volumeID !== volumeID)]
    const volumeIds = updated.map(item => { return { vid: item.volumeID } })

    this.setState({ volumeIds, storagesSelected: updated })

    this.props.setVolumeIds({ volumeIds })
    await this.setGlobal({
      advancedSetup: {
        volumeIds
      }
    }, persistState)
  }

  render () {
    const { storages, storagesSelected } = this.state

    return (
      <div>
        <h2>Storage setup</h2>

        <div className='advstoselect'>
          <CustomSelect
            options={storages ? storages.map(s => s.name) : []}
            onChange={async (event, storageSelected) => {
              if (storageSelected) {
                const selected = storages.filter(storage => storage.name === storageSelected)[0].volumeID
                this.setState({ storageSelected: selected })
                await this.updateState(selected)
              }
            }}
          />
        </div>
        <br />
        <br />
        <div>
          <h2>Added volumes</h2>
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Bootable</td>
                <td>Private</td>
                <td>Read Only</td>
                <td>Shareable</td>
                <td>Own</td>
                <td>Size</td>
                <td>Volume ID</td>
                {/* <td>Server URL</td> */}
                {/* <td>Server</td> */}
                <td>Servers N.</td>
                {/* <td>Servers</td> */}
                <td>Remove</td>
              </tr>
            </thead>
            <tbody>
              {
                storagesSelected && storagesSelected.length > 0 && storagesSelected.map((storage, i) => {
                  return (
                    <tr key={i}>
                      <td>{storage.name}</td>
                      <td>{storage.bootable ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                      <td>{storage.private ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                      <td>{storage.readonly ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                      <td>{storage.shareable ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                      <td>{storage.own ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                      <td>{Utils.formatBytes(storage.size)}</td>
                      <td>{storage.volumeID}</td>
                      {/* <td>{storage.serverurl}</td> */}
                      {/* <td>{storage.server}</td> */}
                      <td>{storage.nservers}</td>
                      {/* <td>{storage.servers}</td> */}
                      <td>
                        <button className='bn28' onClick={() => this.removeStorage(storage.volumeID)}>Remove</button>
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

export default Storage
