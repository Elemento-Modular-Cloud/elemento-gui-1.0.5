import React, { Component } from 'react'
import { Api } from '../../Services'
import { Config } from '../../Global'

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
      window.alert('Could not load templates')
    }
  }

  async getAccessibleStorages () {
    Api.createClient(Config.API_URL_STORAGE)
    const res = await Api.get('/accessible')

    if (res.ok) {
      this.setState({ storages: res.data })
    } else {
      window.alert('Could not retrieve accessible storages')
    }
  }

  async canAllocateVirutalMachine () {
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
          os_family: osFamily,
          os_flavour: 'pop'
        },
        pci: [],
        volumes: volumeIds
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
    const {
      templates, template, storages, storageServer,
      bootable, writable, shareable, visibility, ownership,
      volumeIds
    } = this.state
    const { card, columns } = styles

    return (
      <div>
        <a href='/newvm'>Back</a>
        <h1>Basic Setup</h1>
        <br />

        Virtual machine name:
        <input type='text' onChange={e => this.setState({ name: e.target.value })} />
        <br />

        Select a template:
        <select onChange={e => this.setState({ template: templates[e.target.value] })}>
          <option>...</option>
          {
            templates && templates.length > 0 && templates.map((template, i) =>
              <option key={i} value={i}>{template.info.name}</option>
            )
          }
        </select>

        {
          template &&
            <div>
              <div style={card}>
                <h2>Template</h2>
                <br />
                <p>Name: {template.info.name}</p>
                <p>Description: {template.info.description}</p>
                <br />
                <div style={columns}>
                  <div>
                    <h2>CPU</h2>
                    <p>CPU slots: {template.cpu.slots}</p>
                    <p>Overprovision: {template.cpu.overprovision}</p>
                    <p>Allow SMT: {template.cpu.allowSMT}</p>
                    <p>Archs: {template.cpu.archs}</p>
                    <p>Flags: {template.cpu.flags}</p>
                    <br />
                  </div>
                  <div style={{ marginLeft: 20 }}>
                    <h2>RAM</h2>
                    <p>RAM: {template.ram.ramsize}</p>
                    <p>ECC: {template.ram.reqECC ? 'Yes' : 'No'}</p>
                    <br />
                    <h2>PCI</h2>
                    {
                      template.pci.map((pci, i) => {
                        return (
                          <div key={i}>
                            <p>Vendor: {pci.vendor}</p>
                            <p>Model: {pci.model}</p>
                            <p>Quantity: {pci.quantity}</p>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>

              <h2>OS Selection</h2>
              <input type='radio' id='linux' name='os' value='linux' onChange={() => this.setState({ osFamily: 'linux' })} />
              <label for='linux'>Linux</label><br />
              <input type='radio' id='windows' name='os' value='windows' onChange={() => this.setState({ osFamily: 'windows' })} />
              <label for='windows'>Windows</label><br />
              <input type='radio' id='mac' name='os' value='mac' onChange={() => this.setState({ osFamily: 'mac' })} />
              <label for='mac'>Mac</label>

              <h2>Storage Selection</h2>
              <select
                onChange={e => this.setState({
                  storage: storages[e.target.value],
                  storageServer: storages[e.target.value].server,
                  bootable: storages[e.target.value].server,
                  writable: !storages[e.target.value].readonly,
                  shareable: storages[e.target.value].shareable,
                  visibility: storages[e.target.value].private,
                  ownership: storages[e.target.value].own,
                  volumeIds: [...volumeIds, { vid: storages[e.target.value].volumeID }]
                })}
              >
                <option>...</option>
                {
                  storages && storages.length > 0 && storages.map((storage, i) =>
                    <option key={i} value={i}>{storage.name}</option>
                  )
                }
              </select>
              <p>Storage Server: {storageServer}</p>
              Bootable <input type='checkbox' checked={bootable} disabled /><br />
              Writeable <input type='checkbox' checked={writable} disabled /><br />
              Shareable <input type='checkbox' checked={shareable} disabled /><br />
              Public <input type='checkbox' checked={visibility} disabled /><br />
              Ownership <input type='checkbox' checked={ownership} disabled /><br />

              <br />
              <br />
              <br />

              <button onClick={() => this.canAllocateVirutalMachine()}>Create Virtual Machine</button>
            </div>
        }
      </div>
    )
  }
}

const styles = {
  card: {
    border: 'solid 1px'
  },
  columns: {
    display: 'flex',
    flexDirection: 'row'
  }
}

export default BasicSetup
