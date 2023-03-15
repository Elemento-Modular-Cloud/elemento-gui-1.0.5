import React, { Component } from 'react'
import { Api } from '../../Services'
import { Config } from '../../Global'

class VirtualMachine extends Component {
  constructor (props) {
    super(props)
    this.state = {
      templates: []
    }
  }

  async componentDidMount () {
    await this.getStatus()
  }

  async getStatus () {
    Api.createClient(Config.API_URL_MATCHER)
    const res = await Api.get('/status', {})

    if (res.ok) {
      this.setState({ vms: res.data })
    } else {
      window.alert('Could not load vms')
    }
  }

  async deleteVirtualMachine (uniqueID) {
    Api.createClient(Config.API_URL_MATCHER)
    const res = await Api.post('/unregister', {
      local_index: uniqueID
    })

    if (res.ok) {
      window.alert('Virtual machine deleted succesfully')
      await this.getStatus()
    } else {
      window.alert('Could not delete the selected virtual machine')
    }
  }

  render () {
    const { vms } = this.state
    const { page, body } = styles

    return (
      <div style={page}>
        <div style={body}>
          <a href='/'>Back</a>

          <h1>Virtual Machines</h1>

          <a href='/newvm'>New Virtual Machine</a>

          <h2>Status</h2>

          <table>
            <thead>
              <tr>
                <td>CPU Slots</td>
                <td>Overprovision</td>
                <td>Allow SMT</td>
                <td>Architecture</td>
                {/* <td>Flags</td> */}
                <td>RAM size</td>
                <td>RAM ECC</td>
                <td>Volumes</td>
                {/* <td>PCI devices</td> */}
                {/* <td>NET devices</td> */}
                <td>OS Family</td>
                <td>OS Falvour</td>
                <td>Name</td>
                <td>Date</td>
                {/* <td>Network</td> */}
                <td>Viewer</td>
                <td>Delete</td>
              </tr>
            </thead>
            <tbody>
              {
                vms && vms.length > 0 && vms.map((vm, i) => {
                  const uniqueID = vm.uniqueID
                  const detail = vm.req_json

                  return (
                    <tr key={i}>
                      <td>{detail.slots}</td>
                      <td>{detail.overprovision}</td>
                      <td>{detail.allowSMT ? 'Yes' : 'No'}</td>
                      <td>{detail.arch}</td>
                      {/* <td>{JSON.stringify(detail.flags)}</td> */}
                      <td>{detail.ramsize}</td>
                      <td>{detail.reqECC ? 'Yes' : 'No'}</td>
                      <td>{detail.volumes.map(volume => volume.name).join(',')}</td>
                      {/* <td>{JSON.stringify(detail.pcidevs)}</td> */}
                      {/* <td>{JSON.stringify(detail.netdevs)}</td> */}
                      <td>{detail.os_family}</td>
                      <td>{detail.os_flavour}</td>
                      <td>{detail.vm_name}</td>
                      <td>{detail.creation_date}</td>
                      {/* <td>{JSON.stringify(detail.network_config)}</td> */}
                      <td><button onClick={async () => window.open(detail.viewer, '_blank')}>Viewer</button></td>
                      <td><button onClick={async () => await this.deleteVirtualMachine(uniqueID)}>Delete</button></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
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

export default VirtualMachine
