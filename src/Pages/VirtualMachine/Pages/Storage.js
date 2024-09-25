import React, { Component } from 'reactn'
import { Api, persistState } from '../../../Services'
import { Config, Utils } from '../../../Global'
import { Loader, StorageSelect } from '../../../Components'
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
    this.setState({ loading: true })
    const storages = await this.getAccessibleStorages()

    const { advancedSetup: { volumeIds } } = this.global
    const storagesSelected = []
    volumeIds && volumeIds.length > 0 && volumeIds.forEach(volume => {
      storagesSelected.push(storages.filter(storage => storage.volumeID === volume.vid)[0])
    })

    this.setState({
      storagesIds: volumeIds || [],
      storagesSelected,
      loading: false
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

    const volumeIds = storageSelected.map(s => { return { vid: s.volumeID } })

    this.props.setVolumeIds({ volumeIds })
    await this.setGlobal({
      advancedSetup: {
        ...advancedSetup,
        volumeIds
      }
    }, persistState)
  }

  async addStorage () {
    const { storageSelected, storagesSelected, storages } = this.state
    const exists = storagesSelected.filter(s => s.name === storageSelected)
    const newStoragesSelected = [...storagesSelected, storages.filter(s => s.name === storageSelected)[0]]

    exists.length === 0 && this.setState({
      storagesSelected: newStoragesSelected,
      storageSelected: null
    })

    await this.updateState(newStoragesSelected)
  }

  async removeStorage (volumeID) {
    try {
      const { storagesSelected } = this.state
      const removed = storagesSelected.filter(s => s.volumeID !== volumeID)
      this.setState({ storagesSelected: [...removed], storageSelected: null })
      await this.updateState([...removed])
    } catch (error) {}
  }

  render () {
    const { loading, storages, storagesSelected, storageSelected } = this.state

    return (
      <div className='advmain'>
        <h2>Storage setup</h2>

        <p>ⓘ You can mount as many storage as you want, there is no limit!</p>

        <div className='advstoselect'>
          <StorageSelect
            options={storages ? storages.map(s => { return { name: `${s.name} (${s.volumeID.substring(0, 8)})`, private: s.private } }) : []}
            onChange={(event, storageSelected) => {
              if (storageSelected && storageSelected.name) {
                const name = storageSelected.name.split(' (')[0]
                this.setState({ storageSelected: name })
              }
            }}
          />
          {storageSelected && <button className='bn632-hover bn22' onClick={() => this.addStorage()}>Mount</button>}
        </div>
        <br />
        <br />
        <div>
          <h2>Added volumes</h2>
          <table className='stopagetable'>
            <thead>
              <tr>
                <td>Name</td>
                <td>Bootable</td>
                <td>Private</td>
                <td>Read Only</td>
                <td>Shareable</td>
                <td>Own</td>
                <td>Size</td>
                {/* <td>Volume ID</td> */}
                {/* <td>Server URL</td> */}
                {/* <td>Server</td> */}
                <td>Servers N.</td>
                {/* <td>Servers</td> */}
                <td>Remove</td>
              </tr>
            </thead>
            <tbody>
              {loading && <Loader />}
              {
                !loading && storagesSelected && storagesSelected.length > 0 && storagesSelected.map((storage, i) => {
                  return (
                    <tr key={i}>
                      <td>{storage.name}</td>
                      <td>{storage.bootable ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                      <td>{storage.private ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                      <td>{storage.readonly ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                      <td>{storage.shareable ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                      <td>{storage.own ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                      <td>{Utils.formatBytes(storage.size)}</td>
                      {/* <td>{storage.volumeID}</td> */}
                      {/* <td>{storage.serverurl}</td> */}
                      {/* <td>{storage.server}</td> */}
                      <td>{storage.nservers}</td>
                      {/* <td>{storage.servers}</td> */}
                      <td>
                        <button className='bn632-hover bn28' onClick={() => this.removeStorage(storage.volumeID)}>Unmount</button>
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
