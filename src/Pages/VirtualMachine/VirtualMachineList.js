import React, { Component } from 'react'
import { Api } from '../../Services'
import { Config } from '../../Global'
import './css/VirtualMachineList.css'
import { Sidebar, Navigate } from '../../Components'
import { ReactComponent as Arrow } from '../../Assets/utils/arrow.svg'

class VirtualMachineList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      templates: [],
      loading: false
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
    this.setState({ loading: true })
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
    this.setState({ loading: false })
  }

  render () {
    const { vms, loading } = this.state

    return (
      <div className='vmlpage'>
        <Sidebar selected='vms' />
        <div className='vmlbody'>
          <hr />

          <div className='vmlheader'>
            <span>Virtual Machines</span>
            <a href='/'>Back</a>
          </div>

          {loading && <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>}

          {
            !loading &&
              <>
                <Navigate className='stobtnnew' page='/newvm'>
                  <div className='vmlbtncontainer'>
                    <span>CREATE NEW VIRTUAL MACHINE</span>
                    <Arrow />
                  </div>
                </Navigate>

                <div className='vmltables'>
                  <table className='vmltable'>
                    <thead className='vmltablehead'>
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
                    <tbody className='vmltablebody'>
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
                              <td><button className='bn632-hover bn22' onClick={async () => window.open(detail.viewer, '_blank')}>Viewer</button></td>
                              <td><button className='bn632-hover bn28' onClick={async () => await this.deleteVirtualMachine(uniqueID)}>Delete</button></td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </>
          }
        </div>
      </div>
    )
  }
}

export default VirtualMachineList
