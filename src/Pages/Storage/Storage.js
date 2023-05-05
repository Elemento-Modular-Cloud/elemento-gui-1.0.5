import React, { Component } from 'react'
import Modal from 'react-modal'
import { Api } from '../../Services'
import { Config, Utils } from '../../Global'
import { Sidebar } from '../../Components'
import './Storage.css'
import { ReactComponent as Arrow } from '../../Assets/utils/arrow.svg'
import { ReactComponent as CheckGreen } from '../../Assets/utils/checkgreen.svg'
import { ReactComponent as CheckRed } from '../../Assets/utils/checkred.svg'
import swal from 'sweetalert'

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
      showModal: false,
      loadingNewStorage: false
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

    if (res.ok && res.data && res.data.length > 0) {
      const personalStorages = res.data ? res.data.filter(storage => storage.own) : []
      const publicStorages = res.data ? res.data.filter(storage => !storage.own) : []

      this.setState({ personalStorages, publicStorages })
    }
  }

  async createStorage () {
    this.setState({ loadingNewStorage: true })
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
        swal('Success!', 'The new storage has been created', 'success', {
          buttons: false,
          timer: 3000
        })
        await this.getAccessibleStorages()
      } else {
        swal('Error', 'Could not create the new storage', 'error', {
          buttons: false,
          timer: 3000
        })
      }
    } else {
      swal('Error', 'Could not create a new storage as per configuration parameters', 'error', {
        buttons: false,
        timer: 3000
      })
    }
    this.setState({ showModal: false, loadingNewStorage: false })
  }

  async destroyStorage (volumeID) {
    const ret = await Api.post('/destroy', {
      volume_id: volumeID
    })
    if (ret.ok) {
      swal('Success!', 'The selected storage has been destroyed', 'success', {
        buttons: false,
        timer: 3000
      })
      await this.getAccessibleStorages()
    } else {
      swal('Error', 'Could not destroy the selected storage', 'error', {
        buttons: false,
        timer: 3000
      })
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
      showModal,
      loadingNewStorage
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
              Personal Volumes
            </span>
            <span
              style={{ marginLeft: 20, color: selector === 'public' ? '#f28e00' : '#898C8A', textDecorationLine: selector === 'public' ? 'underline' : 'none' }}
              onClick={() => this.setState({ selector: 'public' })}
            >
              Public Volumes
            </span>
          </div>

          <div className='stotables'>
            {
              selector === 'personal' &&
                <table className='stotable'>
                  <thead className='stotablehead'>
                    <tr>
                      <td>Name</td>
                      <td style={{ width: 80 }}>Bootable</td>
                      <td style={{ width: 80 }}>Private</td>
                      <td style={{ width: 80 }}>Read Only</td>
                      <td style={{ width: 80 }}>Shareable</td>
                      <td style={{ width: 80 }}>Own</td>
                      <td style={{ width: 80 }}>Size</td>
                      <td style={{ maxWidth: 200 }}>Volume ID</td>
                      <td style={{ display: 'none' }}>Server URL</td>
                      <td>Server</td>
                      <td>Servers N.</td>
                      <td style={{ display: 'none' }}>Servers</td>
                      <td>Destroy</td>
                    </tr>
                  </thead>
                  {loading && <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>}
                  {
                    !loading &&
                      <tbody className='stotablebody'>
                        {
                          personalStorages && personalStorages.length > 0 && personalStorages.map((storage, i) => {
                            return (
                              <tr key={i}>
                                <td style={{ fontWeight: 'bold' }}>{storage.name}</td>
                                <td style={{ width: 80 }}>{storage.bootable ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ width: 80 }}>{storage.private ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ width: 80 }}>{storage.readonly ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ width: 80 }}>{storage.shareable ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ width: 80 }}>{storage.own ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ width: 80 }}>{Utils.formatBytes(storage.size)}</td>
                                <td style={{ maxWidth: 200, overflow: 'scroll' }}>{storage.volumeID}</td>
                                <td style={{ display: 'none' }}>{storage.serverurl}</td>
                                <td>{storage.server}</td>
                                <td>{storage.nservers}</td>
                                <td style={{ display: 'none' }}>{storage.servers.join(' - ')}</td>
                                <td>
                                  <button className='bn632-hover bn28' onClick={async () => await this.destroyStorage(storage.volumeID)}>Destroy</button>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                  }
                </table>
            }

            {
              selector === 'public' &&
                <table className='stotable'>
                  <thead className='stotablehead'>
                    <tr>
                      <td>Name</td>
                      <td style={{ width: 80 }}>Bootable</td>
                      <td style={{ width: 80 }}>Private</td>
                      <td style={{ width: 80 }}>Read Only</td>
                      <td style={{ width: 80 }}>Shareable</td>
                      <td style={{ width: 80 }}>Own</td>
                      <td style={{ width: 80 }}>Size</td>
                      <td style={{ maxWidth: 200 }}>Volume ID</td>
                      <td style={{ display: 'none' }}>Server URL</td>
                      <td>Server</td>
                      <td>Servers N.</td>
                      <td style={{ display: 'none' }}>Servers</td>
                      <td>Destroy</td>
                    </tr>
                  </thead>
                  {loading && <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>}
                  {
                    !loading &&
                      <tbody className='stotablebody'>
                        {
                          publicStorages && publicStorages.length > 0 && publicStorages.map((storage, i) => {
                            return (
                              <tr key={i}>
                                <td style={{ fontWeight: 'bold' }}>{storage.name}</td>
                                <td style={{ width: 80 }}>{storage.bootable ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ width: 80 }}>{storage.private ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ width: 80 }}>{storage.readonly ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ width: 80 }}>{storage.shareable ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ width: 80 }}>{storage.own ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ width: 80 }}>{Utils.formatBytes(storage.size)}</td>
                                <td style={{ maxWidth: 200, overflow: 'scroll' }}>{storage.volumeID}</td>
                                <td style={{ display: 'none' }}>{storage.serverurl}</td>
                                <td>{storage.server}</td>
                                <td>{storage.nservers}</td>
                                <td style={{ display: 'none' }}>{storage.servers.join(' - ')}</td>
                                <td>
                                  <button className='bn632-hover bn28' onClick={async () => await this.destroyStorage(storage.volumeID)}>Destroy</button>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                  }
                </table>
            }
          </div>

          <Modal
            isOpen={showModal}
            style={customStyle}
            className='stomodal'
            ariaHideApp={false}
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
                <button className={size === 125 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 125 })}>125GB</button>
                <button className={size === 250 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 250 })}>250GB</button>
                <button className={size === 500 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 500 })}>500GB</button>
                <br />
                <button className={size === 1000 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 1000 })}>1TB</button>
                <button className={size === 2000 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 2000 })}>2TB</button>
                <button className={size === 4000 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 4000 })}>4TB</button>
                <br />
                <button className={size === 8000 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 8000 })}>8TB</button>
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

            {
              !loadingNewStorage &&
                <div
                  className='stobutton'
                  onClick={async () => await this.createStorage()}
                >
                  <span>Create Storage</span>
                </div>
            }
            {loadingNewStorage && <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>}
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
