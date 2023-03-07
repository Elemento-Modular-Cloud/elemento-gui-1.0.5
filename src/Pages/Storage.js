import React, { Component } from 'react'
import { Api } from '../Services'
import { Config } from '../Global'

class Storage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      storages: [],
      name: '',
      size: 0,
      privateStorage: false,
      shareableStorage: false,
      bootableStorage: false,
      readonlyStorage: false
    }
  }

  async componentDidMount () {
    Api.createClient(Config.API_URL_STORAGE)
    const res = await Api.get('/accessible')

    if (res.ok) {
      this.setState({ storages: res.data })
    }
  }

  render () {
    const {
      storages,
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

          <h2>Storages accessible</h2>
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
                storages && storages.length > 0 && storages.map((storage, i) => {
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

          <br />
          <h2>Create new volume</h2>
          Name:
          <input type='text' value={name} onChange={e => this.setState({ name: e.target.value })} />
          <br />
          Size:
          <input type='number' value={size} onChange={e => this.setState({ size: e.target.value })} />
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
