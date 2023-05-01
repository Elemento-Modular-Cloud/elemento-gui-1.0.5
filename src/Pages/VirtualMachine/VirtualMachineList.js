import React, { Component } from 'react'
import { Api } from '../../Services'
import { Config, Utils } from '../../Global'
import './css/VirtualMachineList.css'
import { Sidebar, Navigate } from '../../Components'
import { ReactComponent as Arrow } from '../../Assets/utils/arrow.svg'
import swal from 'sweetalert'
import { ReactComponent as CheckGreen } from '../../Assets/utils/checkgreen.svg'
import { ReactComponent as CheckRed } from '../../Assets/utils/checkred.svg'

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
    this.setState({ loading: true })
    Api.createClient(Config.API_URL_MATCHER)
    const res = await Api.get('/status', {})

    if (res.ok) {
      this.setState({ vms: res.data })
    } else {
      swal('Error', 'Could not load vms', 'error', {
        buttons: false,
        timer: 3000
      })
    }
    this.setState({ loading: false })
  }

  async deleteVirtualMachine (uniqueID) {
    this.setState({ loading: true })
    Api.createClient(Config.API_URL_MATCHER)
    const res = await Api.post('/unregister', {
      local_index: uniqueID
    })

    if (res.ok) {
      swal('Success', 'Virtual machine deleted succesfully', 'success', {
        buttons: false,
        timer: 3000
      })
      await this.getStatus()
    } else {
      swal('Error', 'Could not delete the selected virtual machine', 'error', {
        buttons: false,
        timer: 3000
      })
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
                        <td>Name</td>
                        <td>Architecture</td>
                        <td>CPU Slots</td>
                        <td>Overprovision</td>
                        <td>SMT</td>
                        {/* <td>Flags</td> */}
                        <td>RAM size</td>
                        <td>ECC</td>
                        <td>Volumes</td>
                        {/* <td>PCI devices</td> */}
                        {/* <td>NET devices</td> */}
                        <td>OS Family</td>
                        <td>OS Falvour</td>
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
                              <td>{detail.vm_name}</td>
                              <td>{detail.arch}</td>
                              <td>{detail.slots}</td>
                              <td>{detail.overprovision}</td>
                              <td>{detail.allowSMT ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                              {/* <td>{JSON.stringify(detail.flags)}</td> */}
                              <td>{Utils.formatBytes(detail.ramsize * 1000000000)}</td>
                              <td>{detail.reqECC ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</td>
                              <td>{detail.volumes.map(volume => volume.name).join(',')}</td>
                              {/* <td>{JSON.stringify(detail.pcidevs)}</td> */}
                              {/* <td>{JSON.stringify(detail.netdevs)}</td> */}
                              <td>{detail.os_family}</td>
                              <td>{detail.os_flavour}</td>
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
