import React, { Component } from 'react'
import { Api } from '../../Services'
import { Config, Utils } from '../../Global'
import './css/VirtualMachineList.css'
import { Sidebar, Navigate, Back, Daemons, Loader } from '../../Components'
import { ReactComponent as Arrow } from '../../Assets/utils/arrow.svg'
import swal from 'sweetalert'
import { ReactComponent as CheckGreen } from '../../Assets/utils/checkgreen.svg'
import { ReactComponent as CheckRed } from '../../Assets/utils/checkred.svg'

class VirtualMachineList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      templates: [],
      loading: false,
      toBeDeleted: null
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
    this.setState({ loading: false, toBeDeleted: null })
  }

  async deleteVirtualMachine (uniqueID) {
    this.setState({ toBeDeleted: uniqueID, loading: true })
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
      }).then(() => {
        this.setState({ toBeDeleted: null, loading: false })
      })
    }
  }

  getLocalTimezonDate (creationDate) {
    // Step 1: Parse the provided date string to a JavaScript Date object
    const dateParts = creationDate.split(/[\s,]+/) // Splitting the date and time parts
    const [month, day, year] = dateParts[0].split('/') // Extracting month, day, year
    const [hours, minutes, seconds] = dateParts[1].split(':') // Extracting hours, minutes, seconds

    const parsedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds)) // Month is 0-based in Date constructor

    // Step 2: Convert the Date object to ISO string format
    const isoString = parsedDate.toISOString()

    // Given input date in UTC
    const utcDate = new Date(isoString)

    // Obtain user's timezone dynamically
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Options for formatting the date
    const options = {
      timeZone: userTimezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }

    // Convert to user's timezone and format as string
    const userLocalDate = utcDate.toLocaleString(undefined, options)

    return userLocalDate
  }

  render () {
    const { vms, loading, toBeDeleted } = this.state

    return (
      <div className='vmlpage'>
        <Sidebar selected='vms' />
        <div className='lbody vmlbody'>
          <hr />

          <div className='vmlheader'>
            <span>Virtual Machines</span>
            <Back page='/' refresh={async () => await this.getStatus()} />
          </div>

          <Navigate className='stobtnnew' page='/newvm'>
            <div className='vmlbtncontainer' style={{ marginBottom: 40 }}>
              <span>CREATE NEW<br />VIRTUAL MACHINE</span>
              <Arrow />
            </div>

            {loading && <Loader style={{ marginBottom: 40 }} />}
          </Navigate>

          <div className='vmltables'>
            <table className='vmltable'>
              <thead className='vmltablehead'>
                <tr>
                  <td>Name</td>
                  <td>CPU Detail</td>
                  {/* <td>CPU Slots</td>
                  <td>Overprovision</td>
                  <td>SMT</td> */}
                  {/* <td>Flags</td> */}
                  <td>RAM Detail</td>
                  {/* <td>ECC</td> */}
                  <td>Volumes</td>
                  {/* <td>PCI devices</td> */}
                  {/* <td>NET devices</td> */}
                  <td>O.S.</td>
                  {/* <td>OS Flavour</td> */}
                  <td>Date</td>
                  <td>Network</td>
                  <td>SSH</td>
                  <td>Delete</td>
                </tr>
              </thead>
              <tbody className='vmltablebody'>
                {
                  vms && vms.length > 0
                    ? vms.map((vm, i) => {
                      const uniqueID = vm.uniqueID
                      const detail = vm.req_json

                      const creationDate = this.getLocalTimezonDate(detail.creation_date)

                      return (
                        <tr key={i} style={{ backgroundColor: toBeDeleted === vm.uniqueID ? '#898C8A99' : '' }}>
                          <td>
                            <span style={{ fontWeight: 'bold' }}>{detail.vm_name}</span><br />
                            <span style={{ fontStyle: 'italic', fontSize: 12, display: 'block', paddingTop: 8 }}>{uniqueID}</span>
                          </td>
                          <td style={{ minWidth: 180 }}>
                            <div className='inlineitem'><span style={{ fontSize: 14, fontStyle: 'italic' }}>Architecture</span><span>{detail.arch}</span></div>
                            <div className='inlineitem'><span style={{ fontSize: 14, fontStyle: 'italic' }}>CPU Slots</span><span>{detail.slots}</span></div>
                            <div className='inlineitem'><span style={{ fontSize: 14, fontStyle: 'italic' }}>Overprovision</span><span>{detail.overprovision}</span></div>
                            <div className='inlineitem' style={{ alignItems: 'center' }}><span style={{ fontSize: 14, fontStyle: 'italic' }}>SMT</span><span>{detail.allowSMT ? <CheckGreen style={{ width: 20, height: 320 }} /> : <CheckRed style={{ width: 20, height: 20 }} />}</span></div>
                          </td>
                          {/* <td>{JSON.stringify(detail.flags)}</td> */}
                          <td style={{ minWidth: 120 }}>
                            <div className='inlineitem'><span style={{ fontSize: 14, fontStyle: 'italic' }}>Size</span><span>{Utils.formatBytes(detail.ramsize * 1000000000)}</span></div>
                            <div className='inlineitem'><span style={{ fontSize: 14, fontStyle: 'italic' }}>ECC</span><span>{detail.reqECC ? <CheckGreen style={{ width: 20, height: 20 }} /> : <CheckRed style={{ width: 20, height: 20 }} />}</span></div>
                          </td>
                          <td>{detail.volumes.map(volume => volume.name).join(',')}</td>
                          {/* <td>{JSON.stringify(detail.pcidevs)}</td> */}
                          {/* <td>{JSON.stringify(detail.netdevs)}</td> */}
                          <td style={{ minWidth: 120 }}>
                            <div className='inlineitem'><span style={{ fontSize: 14, fontStyle: 'italic' }}>Family</span><span>{detail.os_family}</span></div>
                            <div className='inlineitem'><span style={{ fontSize: 14, fontStyle: 'italic' }}>Flavour</span><span>{detail.os_flavour}</span></div>
                          </td>
                          <td>{creationDate}</td>
                          <td style={{ minWidth: 100 }}>{detail.network_config?.ipv4}</td>
                          {/* <td><button className='bn632-hover bn22' onClick={async () => !toBeDeleted && window.open(detail.viewer, '_blank')}>Viewer</button></td> */}
                          <td style={{ minWidth: 100 }}>{detail.network_config?.ipv4 ? `ssh ${detail.network_config?.ipv4}` : ''}</td>
                          <td><button className='bn632-hover bn28' onClick={async () => !toBeDeleted && await this.deleteVirtualMachine(uniqueID)}>Delete</button></td>
                        </tr>
                      )
                    })
                    : (
                      <tr><td style={{ border: 'none' }}><p style={{ marginLeft: 10 }}>{loading ? 'Loading...' : 'ⓘ No virtual machines to be displayed'}</p></td></tr>
                      )
                }
              </tbody>
            </table>
          </div>
        </div>

        <Daemons />
      </div>
    )
  }
}

export default VirtualMachineList
