import React, { Component } from 'react'
import Modal from 'react-modal'
import { Api } from '../../Services'
import { Config, Utils } from '../../Global'
import { Sidebar } from '../../Components'
import './Storage.css'
import { ReactComponent as Arrow } from '../../Assets/utils/arrow.svg'

Modal.defaultStyles.overlay.backgroundColor = '#f28e00bb'

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
      readonlyStorage: false,
      loading: false,
      selector: 'personal',
      showModal: false
    }
  }

  async componentDidMount () {
    this.setState({ loading: true })
    await this.getAccessibleStorages()
    this.setState({ loading: false })
  }

  async getAccessibleStorages () {
    Api.createClient(Config.API_URL_STORAGE)
    const res = await Api.get('/accessible')

    if (res.ok) {
      const personalStorages = res.data.filter(storage => storage.own)
      const publicStorages = res.data.filter(storage => !storage.own)

      this.setState({ personalStorages, publicStorages })
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
      loading,
      personalStorages,
      publicStorages,
      name,
      size,
      privateStorage,
      shareableStorage,
      bootableStorage,
      readonlyStorage,
      selector,
      showModal
    } = this.state

    return (
      <div className='stopage'>
        <Sidebar selected='storage' />
        <div className='stobody'>
          <hr />

          <div className='stoheader'>
            <span>Storage</span>
            <a href='/'>Back</a>
          </div>

          {loading && <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>}

          {
            !loading &&
              <>
                <div className='stobtnnew' onClick={() => this.setState({ showModal: true })}>
                  <div className='stobtncontainer'>
                    <span>CREATE NEW STORAGE</span>
                    <Arrow />
                  </div>
                </div>

                <div className='stoselector'>
                  <span
                    style={{ color: selector === 'personal' ? '#f28e00' : '#898C8A', textDecorationLine: selector === 'personal' ? 'underline' : 'none' }}
                    onClick={() => this.setState({ selector: 'personal' })}
                  >
                    Personal Storages
                  </span>
                  <span
                    style={{ marginLeft: 20, color: selector === 'public' ? '#f28e00' : '#898C8A', textDecorationLine: selector === 'public' ? 'underline' : 'none' }}
                    onClick={() => this.setState({ selector: 'public' })}
                  >
                    Public Storages
                  </span>
                </div>

                <div className='stotables'>
                  {
                    selector === 'personal' &&
                      <table className='stotable'>
                        <thead className='stotablehead'>
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
                        <tbody className='stotablebody'>
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
                                    <button className='bn632-hover bn28' onClick={async () => await this.destroyStorage(storage.volumeID)}>Destroy</button>
                                  </td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                  }

                  {
                    selector === 'public' &&
                      <table className='stotable'>
                        <thead className='stotablehead'>
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
                        <tbody className='stotablebody'>
                          {
                            publicStorages && publicStorages.length > 0 && publicStorages.map((storage, i) => {
                              return (
                                <tr key={i}>
                                  <td>{storage.bootable ? 'Yes' : 'No'}</td>
                                  <td>{storage.name}</td>
                                  <td>{storage.private ? 'Yes' : 'No'}</td>
                                  <td>{storage.readonly ? 'Yes' : 'No'}</td>
                                  <td>{storage.shareable ? 'Yes' : 'No'}</td>
                                  <td>{Utils.formatBytes(storage.size)}</td>
                                  <td>{storage.volumeID}</td>
                                  <td>{storage.serverurl}</td>
                                  <td>{storage.server}</td>
                                  <td>{storage.own ? 'Yes' : 'No'}</td>
                                  <td>{storage.nservers}</td>
                                  <td>{storage.servers}</td>
                                  <td>
                                    <button className='bn632-hover bn28' onClick={async () => await this.destroyStorage(storage.volumeID)}>Destroy</button>
                                  </td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                  }
                </div>
              </>
          }

          <Modal
            isOpen={showModal}
            style={customStyle}
            className='stomodal'
            onRequestClose={() => this.setState({ showModal: false })}
          >
            <h2>Create new volume</h2>

            <div className='stomodalinput'>
              <span>Name</span>
              <input type='text' value={name} onChange={e => this.setState({ name: e.target.value })} />
            </div>

            <div className='stosize'>
              <span>Size</span>

              <div className='stosizes'>
                <button className='stosizebtn' value={size} onClick={e => this.setState({ size: 125 })}>125GB</button>
                <button className='stosizebtn' value={size} onClick={e => this.setState({ size: 250 })}>250GB</button>
                <button className='stosizebtn' value={size} onClick={e => this.setState({ size: 500 })}>500GB</button>
                <br />
                <button className='stosizebtn' value={size} onClick={e => this.setState({ size: 1000 })}>1TB</button>
                <button className='stosizebtn' value={size} onClick={e => this.setState({ size: 2000 })}>2TB</button>
                <button className='stosizebtn' value={size} onClick={e => this.setState({ size: 4000 })}>4TB</button>
                <br />
                <button className='stosizebtn' value={size} onClick={e => this.setState({ size: 8000 })}>8TB</button>
              </div>
            </div>

            <div className='stooptions'>
              <span>Private</span>
              <input type='checkbox' value={privateStorage} onChange={e => this.setState({ privateStorage: e.target.checked })} />
            </div>

            <div className='stooptions'>
              <span>Shareable</span>
              <input type='checkbox' value={shareableStorage} onChange={e => this.setState({ shareableStorage: e.target.checked })} />
            </div>

            <div className='stooptions'>
              <span>Bootable</span>
              <input type='checkbox' value={bootableStorage} onChange={e => this.setState({ bootableStorage: e.target.checked })} />
            </div>

            <div className='stooptions'>
              <span>Readonly</span>
              <input type='checkbox' value={readonlyStorage} onChange={e => this.setState({ readonlyStorage: e.target.checked })} />
            </div>

            <div
              className='stobutton'
              onClick={async () => await this.createStorage()}
            >
              <span>Create Storage</span>
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}

const customStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    position: 'absolute',
    zIndex: 999999999999999,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white'
  }
}

export default Storage
