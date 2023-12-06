import React, { Component } from 'react'
import { Api } from '../../Services'
import { Config, Utils } from '../../Global'
import './css/BasicSetup.css'
import { Back, CustomSelect, Loader, Sidebar, WithRouter } from '../../Components'
import { models, vendors } from '../../Global/Model'
import { ReactComponent as Windows } from '../../Assets/os/windows.svg'
import { ReactComponent as Linux } from '../../Assets/os/linux.svg'
import { ReactComponent as CheckGreen } from '../../Assets/utils/checkgreen.svg'
import { ReactComponent as CheckRed } from '../../Assets/utils/checkred.svg'
import swal from 'sweetalert'

class BasicSetup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      name: '',
      templates: [],
      template: null,
      storages: [],
      storage: null,
      storageServer: '',
      osFamily: '',
      bootable: false,
      writable: false,
      shareable: false,
      visibility: false,
      ownership: false,
      volumeIds: [],
      storageSelected: '',
      storagesSelected: []
    }
  }

  async componentDidMount () {
    await this.getTemplates()
    await this.getAccessibleStorages()
  }

  async getTemplates () {
    Api.createClient(Config.API_URL_MATCHER)
    const res = await Api.get('/templates', {})

    if (res.ok) {
      this.setState({ templates: res.data })
    } else {
      swal('Error', 'Could not load templates', 'error', {
        buttons: false,
        timer: 3000
      })
    }
  }

  async getAccessibleStorages () {
    Api.createClient(Config.API_URL_STORAGE)
    const res = await Api.get('/accessible')

    if (res.ok) {
      this.setState({ storages: res.data })
    } else {
      swal('Error', 'Could not retrieve accessible storages', 'error', {
        buttons: false,
        timer: 3000
      })
    }
  }

  async registerVirtualMachine () {
    this.setState({ loading: true })
    const {
      name,
      template,
      osFamily,
      storagesSelected
    } = this.state

    if (!name || name === '' || !/^[a-zA-Z0-9-]*$/.test(name)) {
      swal('Info', 'Please check the VM name before to continue', 'info', {
        buttons: false,
        timer: 3000
      }).then(() => {
        this.setState({ loading: false })
      })
      return
    }
    if (!template) {
      swal('Info', 'Please select a template before to continue', 'info', {
        buttons: false,
        timer: 3000
      }).then(() => {
        this.setState({ loading: false })
      })
      return
    }
    if (osFamily === '') {
      swal('Info', 'Please select the desired OS before to continue', 'info', {
        buttons: false,
        timer: 3000
      }).then(() => {
        this.setState({ loading: false })
      })
      return
    }

    const slots = template.cpu.slots
    const overprovision = template.cpu.overprovision
    const allowSMT = template.cpu.allowSMT
    const archs = template.cpu.archs
    const flags = template.cpu.flags
    const ramsize = template.ram.ramsize
    const reqECC = template.ram.reqECC
    const volumeIds = storagesSelected.map(storage => { return { vid: storage.volumeID } })

    Api.createClient(Config.API_URL_MATCHER)
    const res = await Api.post('/canallocate', {
      slots,
      overprovision,
      allowSMT,
      archs,
      flags,
      ramsize,
      reqECC,
      misc: {
        os_family: osFamily,
        os_flavour: osFamily === 'linux' ? 'ubuntu' : 'windows'
      },
      pci: []
    })

    if (res.ok) {
      const ret = await Api.post('/register', {
        info: {
          vm_name: name
        },
        slots,
        overprovision,
        allowSMT,
        archs,
        flags,
        ramsize,
        reqECC,
        misc: {
          os_family: osFamily,
          os_flavour: osFamily === 'linux' ? 'ubuntu' : 'windows'
        },
        pci: [],
        volumes: volumeIds
      })

      if (ret.ok) {
        swal('Success', 'Virtual machine registered successfully!', 'success', {
          buttons: false,
          timer: 3000
        }).then(() => {
          this.props.navigate('/vmlist')
        })
      } else {
        swal('Error', 'Could not register the new virtual machine', 'error', {
          buttons: false,
          timer: 3000
        })
      }
    } else {
      swal('Error', 'Could not allocate the new virtual machine', 'error', {
        buttons: false,
        timer: 3000
      })
    }
    this.setState({ loading: false })
  }

  addStorage () {
    const { storageSelected, storagesSelected, storages } = this.state
    const exists = storagesSelected.filter(s => s.name === storageSelected)

    exists.length === 0 && this.setState({
      storagesSelected: [...storagesSelected, storages.filter(s => s.name === storageSelected)[0]],
      storageSelected: null
    })
  }

  removeStorage (name) {
    try {
      const { storagesSelected } = this.state
      const removed = storagesSelected.filter(s => s.name !== name)
      this.setState({ storagesSelected: [...removed], storageSelected: null })
    } catch (error) {}
  }

  render () {
    const {
      loading, templates, template, storages, storageServer,
      bootable, writable, shareable, visibility, ownership,
      storage, osFamily, storagesSelected, storageSelected // volumeIds
    } = this.state

    return (
      <div className='baspage'>
        <Sidebar selected='vms' />
        <div className='lbody basbody'>
          <hr />

          <div className='basheader'>
            <span>Create new Virtual Machine</span>
            <Back page='/newvm' />
          </div>

          <span className='bassubtitle'>BASIC SETUP</span>

          <div className='bascontent'>
            <div className='bascenter'>
              <div className='basrow'>
                <div className='basmachine'>
                  <span>Virtual machine name:</span>
                  <input type='text' onChange={e => this.setState({ name: e.target.value })} />
                  <p style={{ fontSize: 12 }}>Use only letters, number,- (dash).</p>
                </div>

                <div className='basmachine'>
                  <span>Select a template:</span>
                  <CustomSelect
                    options={templates ? templates.map(t => t.info.name) : []}
                    onChange={(event, template) => {
                      this.setState({ template: templates.filter(t => t.info.name === template)[0] })
                    }}
                  />
                </div>
              </div>

              <div className='basradio'>
                <span className='bascaption'>OS Selection*</span>
                <div
                  className='basradioitem'
                  onClick={() => this.setState({ osFamily: 'linux' })}
                  style={{ backgroundColor: osFamily === 'linux' ? '#f28e00' : 'white' }}
                >
                  <Linux fill={osFamily === 'linux' ? 'white' : 'black'} />
                </div>
                <div
                  className='basradioitem'
                  onClick={() => this.setState({ osFamily: 'windows' })}
                  style={{ backgroundColor: osFamily === 'windows' ? '#f28e00' : 'white' }}
                >
                  <Windows fill={osFamily === 'windows' ? 'white' : 'black'} />
                </div>
              </div>

              <div className='basstorage'>
                <span className='bascaption'>Storage Selection</span>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <CustomSelect
                    options={storages ? storages.map(s => s.private ? `🔒 ${s.name}` : `🌍 ${s.name}`) : []}
                    onChange={(event, storageSelected) => {
                      if (storageSelected) {
                        this.setState({ storageSelected: storageSelected.substring(3, storageSelected.length) })
                      }
                    }}
                  />
                  {storageSelected && <button className='bn632-hover bn22' onClick={() => this.addStorage()}>Mount</button>}
                </div>

                {
                  storagesSelected.length > 0 &&
                    <table style={{ width: '100%', marginTop: 20, overflow: 'scroll' }}>
                      <thead>
                        <tr>
                          <td>Name</td>
                          <td style={{ minWidth: 80 }}>Bootable</td>
                          <td style={{ minWidth: 80 }}>Read Only</td>
                          <td style={{ minWidth: 80 }}>Shareable</td>
                          <td style={{ minWidth: 80 }}>Private</td>
                          <td style={{ minWidth: 80 }}>Own</td>
                          <td>Unmount</td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          storagesSelected.length > 0 && storagesSelected.map((storage, i) => {
                            return (
                              <tr key={i}>
                                <td>{storage.name}</td>
                                <td style={{ minWidth: 80 }}>{storage.bootable ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ minWidth: 80 }}>{storage.readonly ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ minWidth: 80 }}>{storage.shareable ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ minWidth: 80 }}>{storage.private ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td style={{ minWidth: 80 }}>{storage.own ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                                <td><button className='bn632-hover bn28' onClick={() => this.removeStorage(storage.name)}>Unmount</button></td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                }

                <div className='basstorageinfo' style={{ display: storage ? 'block' : 'none' }}>
                  <p>Storage Server: {storageServer}</p>
                  <div className='basstoitem'>
                    <span>Bootable</span><input type='checkbox' checked={bootable} disabled /><br />
                  </div>
                  <div className='basstoitem'>
                    <span>Writeable</span><input type='checkbox' checked={writable} disabled /><br />
                  </div>
                  <div className='basstoitem'>
                    <span>Shareable</span><input type='checkbox' checked={shareable} disabled /><br />
                  </div>
                  <div className='basstoitem'>
                    <span>Public</span><input type='checkbox' checked={visibility} disabled /><br />
                  </div>
                  <div className='basstoitem'>
                    <span>Ownership</span><input type='checkbox' checked={ownership} disabled /><br />
                  </div>
                </div>
              </div>
            </div>
            <div className='basright'>
              <span className='basrtitle'>Summary</span>
              {!template && <span className='basrsubtitle'>Qui troverai il riepilogo del tuo settaggio</span>}
              {
                template &&
                  <div>
                    <div className='bastop'>
                      <div className='bastopname'>
                        <p>Template {template.info.name}</p>
                      </div>
                      <div className='bastoplogo' style={{ backgroundColor: Utils.toRGB(template.info.name) }}>
                        <div>
                          <div className='basspec'><span>{template.cpu.slots}C</span><span>{Utils.formatBytes(template.ram.ramsize * 1000000)}</span></div>
                          <span className='basspectitle'>{template.info.name.substr(0, 2)}</span>
                          <span className='basspecname'>{template.info.name}</span>
                        </div>
                      </div>
                    </div>
                    <p>Description: {template.info.description}</p>
                    <br />
                    <div className='basridetails'>
                      <div className='bascpu'>
                        <h2>CPU</h2>
                        <span>Slots: {template.cpu.slots}</span>
                        <span>Overprovision: {template.cpu.overprovision}</span>
                        <span>Allow SMT: {template.cpu.allowSMT}</span>
                        <span>Archs: {template.cpu.archs}</span>
                        <span>Flags: {template.cpu.flags.join(', ')}</span>
                        <br />
                      </div>
                      <div className='basram'>
                        <h2>RAM</h2>
                        <span>RAM: {Utils.formatBytes(template.ram.ramsize * 1000000)}</span>
                        <span>ECC: {template.ram.reqECC ? 'Yes' : 'No'}</span>
                        <br />
                        <h2>PCI</h2>
                        {
                          template.pci && template.pci.length > 0 && template.pci.map((pci, i) => {
                            return (
                              <div key={i}>
                                <span>Vendor: {vendors[Object.keys(vendors).filter(item => item === pci.vendor)[0]]}</span><br /><br />
                                <span>Model: {models[Object.keys(models).filter(item => item === pci.vendor)].filter(item => item[1] === pci.model)[0][0]}</span><br /><br />
                                <span>Quantity: {pci.quantity}</span>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                    {loading && <Loader />}
                    {!loading && <button className='basbutton' onClick={async () => await this.registerVirtualMachine()}>CONFIRM AND CREATE</button>}
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WithRouter(BasicSetup)
