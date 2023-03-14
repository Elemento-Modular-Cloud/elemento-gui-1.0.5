import React, { Component } from 'react'
import { Api } from '../Services'
import { Config } from '../Global'

class Storage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      personalStorages: [],
      publicStorages: [],
      name: '',
      size: 0,
      privateStorage: false,
      shareableStorage: false,
      bootableStorage: false,
      readonlyStorage: false
    }
  }

  async componentDidMount () {
    await this.getAccessibleStorages()
  }

  async getAccessibleStorages () {
    Api.createClient(Config.API_URL_STORAGE)
    const res = await Api.get('/accessible')

    if (res.ok) {
      const personalStorages = res.data.filter(storage => storage.own)
      const publicStorages = res.data.filter(storage => !storage.own)

      this.setState({ personalStorages, publicStorages })
    } else {
      window.alert('Could not retrieve accessible storages')
    }
  }

  async createStorage () {
    const {
      name,
      size,
      privateStorage,
      shareableStorage,
      bootableStorage,
      readonlyStorage
    } = this.state

    Api.createClient(Config.API_URL_STORAGE)
    const res = await Api.post('/cancreate', {
      name,
      size,
      private: privateStorage,
      shareable: shareableStorage,
      bootable: bootableStorage,
      readonly: readonlyStorage
    })

    if (res.ok) {
      const ret = await Api.post('/create', {
        name,
        size,
        private: privateStorage,
        shareable: shareableStorage,
        bootable: bootableStorage,
        readonly: readonlyStorage
      })
      if (ret.ok) {
        window.alert('The new storage has been created')
        await this.getAccessibleStorages()
      } else {
        window.alert('Could not create the new storage')
      }
    } else {
      window.alert('Could not create a new storage as per configuration parameters')
    }
  }

  async destroyStorage (volumeID) {
    const ret = await Api.post('/destroy', {
      volume_id: volumeID
    })
    if (ret.ok) {
      window.alert('The selected storage has been destroyed')
      await this.getAccessibleStorages()
    } else {
      window.alert('Could not destroy the selected storage')
    }
  }

  render () {
    const {
      personalStorages,
      publicStorages,
      name,
      size,
      privateStorage,
      shareableStorage,
      bootableStorage,
      readonlyStorage
    } = this.state
    const { page, body } = styles

    return (
      <div style={page}>
        <div style={body}>
          <a href='/'>Back</a>
          <h1>Storage</h1>
          <br />

          <h2>Personal Storages</h2>
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
                <td>Destroy</td>
              </tr>
            </thead>
            <tbody>
              {
                personalStorages && personalStorages.length > 0 && personalStorages.map((storage, i) => {
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
                      <td>
                        <button onClick={async () => await this.destroyStorage(storage.volumeID)}>Destroy</button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>

          <h2>Public Storages</h2>
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
                publicStorages && publicStorages.length > 0 && publicStorages.map((storage, i) => {
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
                      <td>
                        <button onClick={async () => await this.destroyStorage(storage.volumeID)}>Destroy</button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>

          <br />
          <h2>Create new volume</h2>
          Name:
          <input type='text' value={name} onChange={e => this.setState({ name: e.target.value })} />
          <br />
          Size: {size}
          <button value={size} onClick={e => this.setState({ size: 125 })}>125GB</button>
          <button value={size} onClick={e => this.setState({ size: 250 })}>250GB</button>
          <button value={size} onClick={e => this.setState({ size: 500 })}>500GB</button>
          <button value={size} onClick={e => this.setState({ size: 1000 })}>1TB</button>
          <button value={size} onClick={e => this.setState({ size: 2000 })}>2TB</button>
          <button value={size} onClick={e => this.setState({ size: 4000 })}>4TB</button>
          <button value={size} onClick={e => this.setState({ size: 8000 })}>8TB</button>
          <br />
          Private:
          <input type='checkbox' value={privateStorage} onChange={e => this.setState({ privateStorage: e.target.checked })} />
          <br />
          Shareable:
          <input type='checkbox' value={shareableStorage} onChange={e => this.setState({ shareableStorage: e.target.checked })} />
          <br />
          Bootable:
          <input type='checkbox' value={bootableStorage} onChange={e => this.setState({ bootableStorage: e.target.checked })} />
          <br />
          Readonly:
          <input type='checkbox' value={readonlyStorage} onChange={e => this.setState({ readonlyStorage: e.target.checked })} />
          <br />
          <button onClick={() => this.createStorage()}>Create Storage</button>
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

export default Storage
