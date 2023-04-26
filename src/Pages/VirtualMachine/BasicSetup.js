import React, { Component } from 'react'
import { Api } from '../../Services'
import { Config } from '../../Global'
import './css/BasicSetup.css'
import { Sidebar } from '../../Components'
import { ReactComponent as Windows } from '../../Assets/os/windows.svg'
import { ReactComponent as Linux } from '../../Assets/os/linux.svg'
import { ReactComponent as Apple } from '../../Assets/os/apple.svg'
import swal from 'sweetalert'

class BasicSetup extends Component {
  constructor (props) {
    super(props)
    this.state = {
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
      volumeIds: []
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

  async registerVirutalMachine () {
    const {
      name,
      template,
      osFamily,
      volumeIds
    } = this.state

    const slots = template.cpu.slots
    const overprovision = template.cpu.overprovision
    const allowSMT = template.cpu.allowSMT
    const archs = template.cpu.archs
    const flags = template.cpu.flags
    const ramsize = template.ram.ramsize
    const reqECC = template.ram.reqECC

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
        os_flavour: 'pop'
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
          os_flavour: 'pop'
        },
        pci: [],
        volumes: volumeIds
      })

      if (ret.ok) {
        swal('Success', 'Virtual machine registered successfully!', 'success', {
          buttons: false,
          timer: 3000
        })
        window.location.href = '/vmlist'
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
  }

  render () {
    const {
      templates, template, storages, storageServer,
      bootable, writable, shareable, visibility, ownership,
      volumeIds, storage
    } = this.state

    return (
      <div className='baspage'>
        <Sidebar selected='vms' />
        <div className='basbody'>
          <hr />

          <div className='basheader'>
            <span>Create new Virtual Machine</span>
            <a href='/'>Back</a>
          </div>

          <span className='bassubtitle'>BASIC SETUP</span>

          <div className='bascontent'>
            <div className='bascenter'>
              <div className='basrow'>
                <div className='basmachine'>
                  <span>Virtual machine name:</span>
                  <input type='text' onChange={e => this.setState({ name: e.target.value })} />
                </div>

                <div className='basmachine'>
                  <span>Select a template:</span>
                  <select onChange={e => this.setState({ template: templates[e.target.value] })}>
                    <option>...</option>
                    {
                      templates && templates.length > 0 && templates.map((template, i) =>
                        <option key={i} value={i}>{template.info.name}</option>
                      )
                    }
                  </select>
                </div>
              </div>

              <div className='basradio'>
                <span className='bascaption'>OS Selection*</span>
                <div className='basradioitem'>
                  <input type='radio' id='linux' name='os' value='linux' onChange={() => this.setState({ osFamily: 'linux' })} />
                  <Linux />
                </div>
                <div className='basradioitem'>
                  <input type='radio' id='windows' name='os' value='windows' onChange={() => this.setState({ osFamily: 'windows' })} />
                  <Windows />
                </div>
                <div className='basradioitem'>
                  <input type='radio' id='mac' name='os' value='mac' onChange={() => this.setState({ osFamily: 'mac' })} />
                  <Apple />
                </div>
              </div>

              <div className='basstorage'>
                <span className='bascaption'>Storage Selection</span>
                <select
                  onChange={e => {
                    if (e.target.value === '...') {
                      this.setState({ storage: null })
                    } else {
                      this.setState({
                        storage: storages[e.target.value],
                        storageServer: storages[e.target.value].server,
                        bootable: storages[e.target.value].server,
                        writable: !storages[e.target.value].readonly,
                        shareable: storages[e.target.value].shareable,
                        visibility: storages[e.target.value].private,
                        ownership: storages[e.target.value].own,
                        volumeIds: [...volumeIds, { vid: storages[e.target.value].volumeID }]
                      })
                    }
                  }}
                >
                  <option>...</option>
                  {
                    storages && storages.length > 0 && storages.map((storage, i) =>
                      <option key={i} value={i}>{storage.name}</option>
                    )
                  }
                </select>
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

              <button className='basbutton' onClick={() => this.registerVirutalMachine()}>CONFIRM AND CREATE</button>
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
                      <div className='bastoplogo'>
                        <div>
                          <div className='basspec'><span>{template.cpu.slots}C</span><span>{template.ram.ramsize}{template.ram.ramsize >= 1024 ? 'GB' : 'MB'}</span></div>
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
                        <span>Flags: {template.cpu.flags}</span>
                        <br />
                      </div>
                      <div className='basram'>
                        <h2>RAM</h2>
                        <span>RAM: {template.ram.ramsize}</span>
                        <span>ECC: {template.ram.reqECC ? 'Yes' : 'No'}</span>
                        <br />
                        <h2>PCI</h2>
                        {
                          template.pci && template.pci.length > 0 && template.pci.map((pci, i) => {
                            return (
                              <div key={i}>
                                <span>Vendor: {pci.vendor}</span>
                                <span>Model: {pci.model}</span>
                                <span>Quantity: {pci.quantity}</span>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default BasicSetup
