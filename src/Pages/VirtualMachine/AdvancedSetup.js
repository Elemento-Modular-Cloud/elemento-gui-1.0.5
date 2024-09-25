import React, { Component } from 'reactn'
import swal from 'sweetalert'
import { Config } from '../../Global'
import { getMemories } from '../../Global/Model'
import { Api, persistState } from '../../Services'
import ResumeModal from '../../Components/ResumeModal'
import { Cpu, Memory, Name, Os, Pci, Resume, Storage } from './Pages'
import { Back, BillingModal, Sidebar, WithRouter } from '../../Components'
import './css/AdvancedSetup.css'

const NAME_PAGE = 1
const CPU_PAGE = 2
const MEMORY_PAGE = 3
const OS_PAGE = 4
const STORAGE_PAGE = 5
const PCI_PAGE = 6
// const NETWORK_PAGE = 7
const RESUME_PAGE = 7

class AdvancedSetup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      name: '',
      cpu: {
        cores: 0,
        overprovision: 0,
        archsList: [],
        flags: []
      },
      allowSMT: false,
      memory: {
        size: '250MB',
        ecc: false
      },
      os: {
        os: 'linux',
        flavour: 'ubuntu'
      },
      pci: {
        pci: null
      },
      volumeIds: {
        volumeIds: []
      },
      mesos: null,
      updated: false,
      hoveredDot: null
    }
  }

  async componentDidMount () {
    await this.setGlobal({ advancedSetup: {} }, persistState)
  }

  previous () {
    const { page } = this.state
    this.setState({ page: (page - 1) >= 1 ? (page - 1) : 1 })
  }

  next (flyTo) {
    const {
      page,
      name,
      cpu,
      os
      // memory,
      // volumeIds,
      // pci
    } = this.state

    let next = true

    if (page === NAME_PAGE) {
      if (!/^[a-zA-Z0-9-]*$/.test(name) || name === '' || name.length > 15) {
        swal('Info', 'Please, check the VM name before to continue', 'info', {
          buttons: false,
          timer: 3000
        })
        next = false
      }
    } else if (page === CPU_PAGE) {
      const {
        // cores, overprovision,
        archsList
      } = cpu

      if (archsList.length === 0) {
        swal('Info', 'Please, select at least 1 Architecture', 'info', {
          buttons: false,
          timer: 3000
        })
        next = false
      }
    } else if (page === MEMORY_PAGE) {
      // next = false
    } else if (page === OS_PAGE) {
      if (!os || os.os === '' || !os.flavour) {
        swal('Info', 'Please, select the desired OS and its own flavour before to continue', 'info', {
          buttons: false,
          timer: 3000
        })
        next = false
      }
    } else if (page === STORAGE_PAGE) {
      // next = false
    } else if (page === PCI_PAGE) {
      // next = false
    }

    if (next) {
      if (flyTo) {
        this.setState({ page: flyTo })
      } else {
        this.setState({ page: (page + 1) <= 8 ? (page + 1) : 8 })
      }
    }
  }

  async updateBilling () {
    const {
      name,
      cpu: {
        cores: slots,
        overprovision,
        cpuFrequency,
        archsList,
        flags
      },
      allowSMT,
      memory: {
        size,
        ecc: reqECC
      },
      os: {
        os,
        flavour
      }
    } = this.state

    const memories = getMemories()
    const ramsize = memories.filter(memory => memory.label === size)[0].amount
    const archs = archsList.map(arch => arch.value)

    const data = {
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
      min_frequency: cpuFrequency,
      misc: {
        os_family: os,
        os_flavour: flavour
      },
      pci: [],
      volumes: []
    }

    Api.createClient(Config.API_URL_MATCHER)
    const res = await Api.post('/marketprices', data)
    if (res.ok) {
      this.setState({ mesos: res.data.mesos, updated: true })
    }
  }

  async register ({ provider, ipv4, username, password }) {
    try {
      const { sshKey } = this.global

      const {
        name,
        cpu: {
          cores: slots,
          overprovision,
          cpuFrequency,
          archsList,
          flags
        },
        allowSMT,
        memory: {
          size,
          ecc: reqECC
        },
        os: {
          os,
          flavour
        },
        volumeIds: {
          volumeIds: volumes
        },
        pci: {
          pci
        }
      } = this.state

      const memories = getMemories()
      const ramsize = memories.filter(memory => memory.label === size)[0].amount
      const archs = archsList.map(arch => arch.value)
      const _pci = pci.map(p => {
        return {
          vendor: p.vendorId,
          model: p.modelId,
          quantity: p.quantity
        }
      })

      Api.createClient(Config.API_URL_MATCHER)
      const res = await Api.post('/canallocate', {
        slots,
        overprovision,
        allowSMT,
        archs,
        flags,
        ramsize,
        reqECC,
        min_frequency: cpuFrequency,
        misc: {
          os_family: os,
          os_flavour: flavour
        },
        pci: _pci
      })

      if (res.ok) {
        Api.createClient(Config.API_URL_MATCHER)
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
          min_frequency: cpuFrequency,
          misc: {
            os_family: os,
            os_flavour: flavour
          },
          pci: _pci,
          volumes,
          ip_address: provider !== 'elemento' ? `${provider}.mesos.elemento.cloud` : ipv4,
          authentication: {
            username,
            password,
            'ssh-key': sshKey
          }
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
    } catch (error) {
      swal('Error', 'Could not register the new virtual machine. Please, try again later.', 'error', {
        buttons: false,
        timer: 3000
      })
    }
  }

  handleMouseEnter = (dot) => {
    this.setState({ hoveredDot: dot })
  }

  handleMouseLeave = () => {
    this.setState({ hoveredDot: null })
  }

  render () {
    const { page, mesos, updated, hoveredDot } = this.state

    const dotInfo = {
      1: 'Virtual Machine Name',
      2: 'CPU Setup',
      3: 'Memory Setup',
      4: 'OS Setup',
      5: 'Storage Setup',
      6: 'PCI Setup',
      7: 'Resume'
    }

    return (
      <div className='advpage'>
        <Sidebar selected='vms' />
        <div className='lbody advbody'>
          <hr />

          <div className='advheader'>
            <span>Create new Virtual Machine</span>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {
                page > 1 && page < 7 &&
                  <BillingModal
                    mesos={mesos}
                    updated={updated}
                    detail={{ cores: this.state.cpu.cores, overprovision: this.state.cpu.overprovision, ramsize: this.state.memory.size }}
                    setUpdated={() => this.setState({ updated: false })}
                  />
              }
              <ResumeModal />
              <Back page='/newvm' />
            </div>
          </div>

          <span className='advsubtitle'>ADVANCED SETUP {page === RESUME_PAGE ? 'SUMMARY' : ''}</span>

          <div className='advcenter'>
            {page === NAME_PAGE && <Name setName={name => this.setState({ name })} />}
            {
              page === CPU_PAGE &&
                <Cpu
                  setCpu={async cpu => {
                    this.setState({ cpu })
                    await this.updateBilling()
                  }}
                />
            }
            {
              page === MEMORY_PAGE &&
                <Memory
                  setMemory={async memory => {
                    this.setState({ memory })
                    await this.updateBilling()
                  }}
                />
            }
            {page === OS_PAGE && <Os setOs={os => this.setState({ os })} />}
            {page === STORAGE_PAGE && <Storage setVolumeIds={volumeIds => this.setState({ volumeIds })} />}
            {page === PCI_PAGE && <Pci setPci={pci => this.setState({ pci })} />}
            {/* {page === NETWORK_PAGE && <Network />} */}
            {page === RESUME_PAGE && <Resume register={async (data) => await this.register(data)} back={() => this.previous()} hideBottomBar={false} />}

            <div className='advtools'>
              {page > 1 && page !== RESUME_PAGE && <button className='advprevious' onClick={() => this.previous()}>Previous</button>}
              {page === 1 && page !== RESUME_PAGE && <div className='advpreviousvoid' />}
              {
                page !== RESUME_PAGE &&
                  <div className='advdotsbox'>
                    <div className='advdots'>
                      {[1, 2, 3, 4, 5, 6, 7].map((_page, index) => (
                        <div
                          key={index}
                          className='advdot'
                          style={{ backgroundColor: page >= _page ? '#f28e00' : 'lightgray' }}
                          onMouseEnter={() => this.handleMouseEnter(_page)}
                          onMouseLeave={() => this.handleMouseLeave()}
                          onClick={() => this.next(_page)}
                        >
                          <div className='advdotinner' />
                          {hoveredDot === _page && (
                            <div className='hover-info'>
                              {dotInfo[_page]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <span>{page} of {RESUME_PAGE} completed</span>
                  </div>
              }
              {page !== RESUME_PAGE && <button className='advnext' onClick={() => this.next()}>Next</button>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WithRouter(AdvancedSetup)
