import React, { Component } from 'react'
import Modal from 'react-modal'
import { Api } from '../../Services'
import { Config, Utils } from '../../Global'
import { Back, CustomSelect, Daemons, Loader, Sidebar } from '../../Components'
import './Storage.css'
import { ReactComponent as Arrow } from '../../Assets/utils/arrow.svg'
import { ReactComponent as CheckGreen } from '../../Assets/utils/checkgreen.svg'
import { ReactComponent as CheckRed } from '../../Assets/utils/checkred.svg'
import swal from 'sweetalert'

Modal.defaultStyles.overlay.backgroundColor = '#f28e00bb'

const DEFAULT_STATE = {
  personalStorages: [],
  publicStorages: [],
  name: '',
  size: '',
  amount: '',
  privateStorage: false,
  shareableStorage: false,
  bootableStorage: false,
  readonlyStorage: false,
  loading: false,
  selector: 'personal',
  showModal: false,
  loadingNewStorage: false,
  toBeDeleted: null
}

class Storage extends Component {
  constructor (props) {
    super(props)
    this.state = DEFAULT_STATE
  }

  async componentDidMount () {
    await this.getAccessibleStorages()
  }

  async getAccessibleStorages () {
    this.setState({ loading: true })
    Api.createClient(Config.API_URL_STORAGE)
    const res = await Api.get('/accessible')

    if (res.ok && res.data && res.data.length > 0) {
      const personalStorages = res.data ? res.data.filter(storage => storage.own) : []
      const publicStorages = res.data ? res.data.filter(storage => !storage.own) : []

      this.setState({ personalStorages, publicStorages })
    }
    this.setState({ loading: false, toBeDeleted: null })
  }

  async createStorage () {
    const {
      name,
      size,
      amount,
      privateStorage,
      shareableStorage,
      bootableStorage,
      readonlyStorage
    } = this.state

    if (!name || name === '') {
      swal('Error', 'Please, provide a valid storage name', 'error', { buttons: false, timer: 3000 })
      return
    }
    if (!size || size === '' || (amount === 'TB' && size > 2) || (amount === 'GB' && (size < 50 || size >= 1000))) {
      swal('Error', 'Please, provide a valid storage size (min 50GB, max 2TB)', 'error', { buttons: false, timer: 3000 })
      return
    }
    if (!amount || amount === '') {
      swal('Error', 'Please, provide a valid storage unit of measurement', 'error', { buttons: false, timer: 3000 })
      return
    }

    const sizeInGB = amount === 'GB' ? Number(size) : Number(size * 1000)

    this.setState({ loadingNewStorage: true })
    Api.createClient(Config.API_URL_STORAGE)
    const res = await Api.post('/cancreate', {
      name,
      size: sizeInGB,
      private: privateStorage,
      shareable: shareableStorage,
      bootable: bootableStorage,
      readonly: readonlyStorage
    })

    if (res.ok) {
      const ret = await Api.post('/create', {
        name,
        size: sizeInGB,
        private: privateStorage,
        shareable: shareableStorage,
        bootable: bootableStorage,
        readonly: readonlyStorage
      })
      if (ret.ok) {
        swal('Success!', 'The new storage has been created', 'success', {
          buttons: false,
          timer: 3000
        }).then(async () => {
          this.setState(DEFAULT_STATE)
          await this.getAccessibleStorages()
        })
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
    this.setState({ toBeDeleted: volumeID, loading: true })
    Api.createClient(Config.API_URL_STORAGE)
    const ret = await Api.post('/destroy', {
      volume_id: volumeID
    })
    if (ret.ok) {
      swal('Success!', 'The selected storage has been destroyed', 'success', {
        buttons: false,
        timer: 3000
      }).then(async () => {
        await this.getAccessibleStorages()
      })
    } else {
      swal('Error', 'Could not destroy the selected storage', 'error', {
        buttons: false,
        timer: 3000
      }).then(() => {
        this.setState({ toBeDeleted: null, loading: false })
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
      amount,
      privateStorage,
      shareableStorage,
      bootableStorage,
      readonlyStorage,
      selector,
      showModal,
      loadingNewStorage,
      toBeDeleted
    } = this.state

    return (
      <div className='stopage'>
        <Sidebar selected='storage' />
        <div className='lbody stobody'>
          <hr />

          <div className='stoheader'>
            <span>Storage</span>
            <Back page='/' refresh={async () => await this.getAccessibleStorages()} />
          </div>

          <div className='stobtnnew' onClick={() => this.setState({ showModal: true })}>
            <div className='stobtncontainer'>
              <span>CREATE NEW STORAGE</span>
              <Arrow />
            </div>

            {loading && <Loader />}
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
                  <tbody className='stotablebody'>
                    {
                      personalStorages && personalStorages.length > 0
                        ? personalStorages.map((storage, i) => {
                          return (
                            <tr key={i} style={{ backgroundColor: toBeDeleted === storage.volumeID ? '#898C8A99' : '' }}>
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
                                <button className='bn632-hover bn28' onClick={async () => !toBeDeleted && await this.destroyStorage(storage.volumeID)}>Destroy</button>
                              </td>
                            </tr>
                          )
                        })
                        : (
                          <tr><td style={{ border: 'none' }}><p style={{ marginLeft: 10 }}>{loading ? 'Loading...' : 'ⓘ No personal storage volumes to be displayed'}</p></td></tr>
                          )
                    }
                  </tbody>
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
                  <tbody className='stotablebody'>
                    {
                      publicStorages && publicStorages.length > 0
                        ? publicStorages.map((storage, i) => {
                          return (
                            <tr key={i} style={{ backgroundColor: toBeDeleted === storage.volumeID ? '#898C8A99' : '' }}>
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
                                <button className='bn632-hover bn28' onClick={async () => !toBeDeleted && await this.destroyStorage(storage.volumeID)}>Destroy</button>
                              </td>
                            </tr>
                          )
                        })
                        : (
                          <tr><td style={{ border: 'none' }}><p style={{ marginLeft: 10 }}>{loading ? 'Loading...' : 'ⓘ No public storage volumes to be displayed'}</p></td></tr>
                          )
                    }
                  </tbody>
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
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 }}>
                  <input type='text' style={{ width: 100 }} value={size} onChange={e => this.setState({ size: e.target.value })} />
                  <CustomSelect
                    options={['GB', 'TB']}
                    style={{ width: 120 }}
                    placeholder='UoM'
                    value={amount}
                    onChange={(event, amount) => {
                      this.setState({ amount })
                    }}
                  />
                </div>

                <button className={size === 125 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 125, amount: 'GB' })}>125GB</button>
                <button className={size === 250 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 250, amount: 'GB' })}>250GB</button>
                <button className={size === 500 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 500, amount: 'GB' })}>500GB</button>
                <br />
                <button className={size === 1 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 1, amount: 'TB' })}>1TB</button>
                <button className={size === 2 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 2, amount: 'TB' })}>2TB</button>
                <button className={size === 4 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 4, amount: 'TB' })}>4TB</button>
                <br />
                <button className={size === 8 ? 'stosizebtnselected' : 'stosizebtn'} value={size} onClick={e => this.setState({ size: 8, amount: 'TB' })}>8TB</button>
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
            {loadingNewStorage && <Loader />}
          </Modal>
        </div>

        <Daemons />
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
