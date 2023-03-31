import React, { Component } from 'reactn'
import { Api, persistState } from '../../Services'
import { Cpu, Memory, Name, Network, Os, Pci, Resume, Storage } from './Pages'
import { Config } from '../../Global'
import { getMemories } from '../../Global/Model'

const NAME_PAGE = 1
const CPU_PAGE = 2
const MEMORY_PAGE = 3
const OS_PAGE = 4
const STORAGE_PAGE = 5
const PCI_PAGE = 6
const NETWORK_PAGE = 7
const RESUME_PAGE = 8

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
        size: 0,
        ecc: false
      },
      os: '',
      volumeIds: []
    }
  }

  async componentDidMount () {
    await this.setGlobal({ advancedSetup: {} }, persistState)
  }

  previous () {
    const { page } = this.state
    this.setState({ page: (page - 1) >= 1 ? (page - 1) : 1 })
  }

  next () {
    const { page, name, cpu, memory, os, volumeIds, pci } = this.state

    let next = true

    if (page === NAME_PAGE) {
      console.log(name)

      if (!/^[a-zA-Z0-9_-]*$/.test(name)) {
        window.alert('wrong vm name')
        next = false
      }
    } else if (page === CPU_PAGE) {
      const { cores, overprovision, archsList } = cpu
      console.log(cpu)

      if (cores <= 0 || cores > 8) {
        window.alert('Please, select at least 1 core')
        next = false
      } else if (overprovision <= 0 || overprovision > 8) {
        window.alert('Please, select at least 1 overprovision')
        next = false
      } else if (archsList.length === 0) {
        window.alert('Please, select at least 1 architecture')
        next = false
      }
    } else if (page === MEMORY_PAGE) {
      console.log(memory)
      // next = false
    } else if (page === OS_PAGE) {
      console.log(os)
      if (!os || os.os === '') {
        window.alert('Please, select the desired os')
        next = false
      }
    } else if (page === STORAGE_PAGE) {
      console.log(volumeIds)
      // next = false
    } else if (page === PCI_PAGE) {
      console.log(pci.pci)
    }

    next && this.setState({ page: (page + 1) <= 8 ? (page + 1) : 8 })
  }

  async register () {
    const {
      name,
      cpu: {
        cores: slots,
        overprovision,
        archsList,
        flags
      },
      allowSMT,
      memory: {
        size,
        ecc: reqECC
      },
      os: {
        os
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
        os_family: os,
        os_flavour: 'pop'
      },
      pci
    })

    if (res.ok) {
      window.alert('Can allocate successfully')

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
          os_family: os,
          os_flavour: 'pop'
        },
        pci: [],
        volumes
      })

      if (ret.ok) {
        window.alert('Virtual machine registered successfully!')
        window.location.href = '/vm'
      } else {
        window.alert('Could not register the new virtual machine')
      }
    } else {
      window.alert('Could not allocate the new virtual machine')
    }
  }

  render () {
    const { page } = this.state
    const { body } = styles

    return (
      <div>
        <a href='/newvm'>Back</a>
        <h1>Advanced setup ({page}/8)</h1>

        <div style={body}>
          {page === NAME_PAGE && <Name setName={name => this.setState({ name })} />}
          {page === CPU_PAGE && <Cpu setCpu={cpu => this.setState({ cpu })} />}
          {page === MEMORY_PAGE && <Memory setMemory={memory => this.setState({ memory })} />}
          {page === OS_PAGE && <Os setOs={os => this.setState({ os })} />}
          {page === STORAGE_PAGE && <Storage setVolumeIds={volumeIds => this.setState({ volumeIds })} />}
          {page === PCI_PAGE && <Pci setPci={pci => this.setState({ pci })} />}
          {page === NETWORK_PAGE && <Network />}
          {page === RESUME_PAGE && <Resume register={async () => await this.register()} />}
        </div>
        <div>
          <button onClick={() => this.previous()}>Previous</button>
          <button onClick={() => this.next()}>Next</button>
        </div>
      </div>
    )
  }
}

const styles = {
  body: {
    height: 600
  }
}

export default AdvancedSetup
