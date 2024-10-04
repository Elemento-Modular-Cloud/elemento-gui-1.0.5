import React, { Component, createRef } from 'react'
import swal from 'sweetalert'
import Modal from 'react-modal'
import { Api } from '../../Services'
import { Config, Utils } from '../../Global'
import './css/VirtualMachineList.css'
import { Sidebar, Navigate, Back, Daemons, Loader } from '../../Components'
import { ReactComponent as Arrow } from '../../Assets/utils/arrow.svg'
import { ReactComponent as CheckGreen } from '../../Assets/utils/checkgreen.svg'
import { ReactComponent as CheckRed } from '../../Assets/utils/checkred.svg'
import { ReactComponent as AtomOS } from '../../Assets/atomos.svg'
import google from '../../Assets/google.png'
import ovh from '../../Assets/ovh.png'
import upcloud from '../../Assets/upcloud.png'
import aruba from '../../Assets/aruba.png'
import aws from '../../Assets/aws.png'
import linode from '../../Assets/linode.png'
import azure from '../../Assets/azure.png'
import ionos from '../../Assets/ionos.png'
import gigas from '../../Assets/gigas.png'
import ssh from '../../Assets/utils/ssh.png'
import vnc from '../../Assets/utils/vnc.png'
import rdp from '../../Assets/utils/rdp.png'
import close from '../../Assets/utils/close.png'
import ansible from '../../Assets/ansible.png'

class VirtualMachineList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      templates: [],
      loading: false,
      toBeDeleted: null,
      smartViewerModal: false,
      showDragAndDrop: false,
      credentials: false,
      viewerURL: null,
      username: '',
      password: '',
      targetIp: null
    }
  }

  async componentDidMount () {
    await this.getStatus()
    this.fileInputRef = createRef()
  }

  async getStatus () {
    this.setState({ loading: true })
    Api.createClient(Config.API_URL_MATCHER)
    const res = await Api.get('/status', {})

    console.log(res.data)

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
    swal({
      title: 'Do you want to destroy this virtual machine?',
      text: 'Once deleted, the VM cannot be recovered!',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
      .then(async (willDelete) => {
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
      })
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

  async openSSHViewer () {
    const { host, username, password } = this.state
    this.setState({ credentials: null, smartViewerModal: true, viewerURL: `http://localhost:8000?host=${host}&username=${username}&password=${password}` })
  }

  async openVNCViewer () {
    const { host, username, password } = this.state
    this.setState({ credentials: null, smartViewerModal: true, viewerURL: `http://localhost:10000?host=${host}&username=${username}&password=${password}` })
  }

  async openRDPViewer () {
    const { host, username, password } = this.state
    this.setState({ credentials: null, smartViewerModal: true, viewerURL: `http://localhost:9000?host=${host}&username=${username}&password=${password}` })
  }

  async openExternalLink () {
    window.require('electron').ipcRenderer.send('open-external-link', 'https://github.com/Elemento-Modular-Cloud/elemento-smart-tools/releases')
  }

  async fileUpload (file) {
    const { targetIp } = this.state
    if (!targetIp) {
      swal('Error', 'Could not retrieve machine target ip.', 'error', {
        buttons: false,
        timer: 3000
      }).then(() => {
        this.setState({ loading: false })
        this.setState({ showDragAndDrop: false })
      })
      return
    }

    Api.createClient(Config.API_URL_MATCHER)
    const res = await Api.upload('/process_playbook/file', file, '192.168.3.6')

    if (res.ok) {
      swal('Success', 'Ansible file uploaded succesfully', 'success', {
        buttons: false,
        timer: 3000
      })
      await this.getStatus()
      this.setState({ showDragAndDrop: false })
    } else {
      swal('Error', 'Could not upload file to the selected virtual machine', 'error', {
        buttons: false,
        timer: 3000
      }).then(() => {
        this.setState({ loading: false })
        this.setState({ showDragAndDrop: false })
      })
    }
  }

  render () {
    const { vms, loading, toBeDeleted, smartViewerModal, viewerURL, credentials, username, password, showDragAndDrop, isDragOver } = this.state
    const { containerStyle, browseStyle } = styles

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
                  <td>Viewer</td>
                  <td>Tools</td>
                  <td>Delete</td>
                </tr>
              </thead>
              <tbody className='vmltablebody'>
                {
                  vms && vms.length > 0
                    ? vms.map((vm, i) => {
                      const uniqueID = vm.uniqueID
                      const detail = vm.req_json
                      const creationDate = detail.creation_date ? this.getLocalTimezonDate(detail.creation_date) : ''

                      return (
                        <tr key={i} style={{ backgroundColor: toBeDeleted === vm.uniqueID ? '#898C8A99' : '' }}>
                          <td style={{ position: 'relative', minWidth: 150 }}>
                            <span style={{ fontWeight: 'bold' }}>{detail.vm_name}</span><br />
                            <span style={{ fontStyle: 'italic', fontSize: 12, display: 'block', paddingTop: 8 }}>{uniqueID}</span>
                            {detail.mesos && detail.mesos.provider.toLowerCase() === 'google' && <img src={google} alt='' style={{ width: 45, maxheight: 25, position: 'absolute', top: 5, right: 5 }} />}
                            {detail.mesos && detail.mesos.provider.toLowerCase() === 'ovh' && <img src={ovh} alt='' style={{ width: 45, maxheight: 25, position: 'absolute', top: 5, right: 5 }} />}
                            {detail.mesos && detail.mesos.provider.toLowerCase() === 'upcloud' && <img src={upcloud} alt='' style={{ width: 45, maxheight: 25, position: 'absolute', top: 5, right: 5 }} />}
                            {detail.mesos && detail.mesos.provider.toLowerCase() === 'aruba' && <img src={aruba} alt='' style={{ width: 45, maxheight: 25, position: 'absolute', top: 5, right: 5 }} />}
                            {detail.mesos && detail.mesos.provider.toLowerCase() === 'aws' && <img src={aws} alt='' style={{ width: 45, maxheight: 25, position: 'absolute', top: 5, right: 5 }} />}
                            {detail.mesos && detail.mesos.provider.toLowerCase() === 'linode' && <img src={linode} alt='' style={{ width: 45, maxheight: 25, position: 'absolute', top: 5, right: 5 }} />}
                            {detail.mesos && detail.mesos.provider.toLowerCase() === 'azure' && <img src={azure} alt='' style={{ width: 45, maxheight: 25, position: 'absolute', top: 5, right: 5 }} />}
                            {detail.mesos && detail.mesos.provider.toLowerCase() === 'ionos' && <img src={ionos} alt='' style={{ width: 45, maxheight: 25, position: 'absolute', top: 5, right: 5 }} />}
                            {detail.mesos && detail.mesos.provider.toLowerCase() === 'gigas' && <img src={gigas} alt='' style={{ width: 45, maxheight: 25, position: 'absolute', top: 5, right: 5 }} />}
                            {(!detail.mesos || !detail.mesos.provider) && <AtomOS style={{ width: 35, height: 35, position: 'absolute', top: 5, right: 0 }} />}
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
                          <td style={{ minWidth: 100 }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                              <img src={ssh} alt='' style={{ width: 25 }} onClick={() => this.setState({ host: detail.network_config?.ipv4, credentials: 'ssh' })} />
                              <img src={vnc} alt='' style={{ width: 25 }} onClick={() => this.setState({ host: detail.network_config?.ipv4, credentials: 'vnc' })} />
                              <img src={rdp} alt='' style={{ width: 25 }} onClick={() => this.setState({ host: detail.network_config?.ipv4, credentials: 'rdp' })} />
                            </div>
                          </td>
                          <td style={{ minWidth: 40 }}>
                            <img
                              alt=''
                              src={ansible}
                              style={{ width: 25 }}
                              onClick={() => this.setState({ showDragAndDrop: true, targetIp: detail.network_config?.ipv4 })}
                            />
                          </td>
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

            <Modal
              isOpen={showDragAndDrop}
              style={customStyle}
              className='netmodal'
              ariaHideApp={false}
              onRequestClose={() => this.setState({ showDragAndDrop: !showDragAndDrop })}
            >
              <div
                style={{ ...containerStyle, backgroundColor: isDragOver ? '#e0e0e0' : '#ffffff' }}
                onDragEnter={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  this.setState({ isDragOver: true })
                }}
                onDragLeave={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  this.setState({ isDragOver: false })
                }}
                onDrop={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  this.fileUpload(e.dataTransfer.files[0])
                }}
                onDragOver={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <img src={ansible} alt='Upload' style={{ width: 200, marginTop: 20 }} />
                <p>Upload your ansible configuration file:</p>
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  <div style={{ marginTop: '10px' }}>
                    <span>Drag & Drop</span> or <span style={browseStyle} onClick={() => this.fileInputRef.current.click()}>browse</span>
                    <input type='file' style={{ display: 'none' }} ref={this.fileInputRef} onChange={e => this.fileUpload(e.target.files[0])} />
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '10px' }}>
                    Supports: JPG, JPEG, PNG
                  </div>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={smartViewerModal}
              style={customStyle}
              className='netmodal'
              ariaHideApp={false}
              onRequestClose={() => this.setState({ smartViewerModal: !smartViewerModal })}
            >
              <div style={{ width: window.innerWidth - 10, position: 'relative', top: 10, display: 'flex', justifyContent: 'flex-end' }} onClick={() => this.setState({ smartViewerModal: !smartViewerModal })}>
                <img src={close} alt='' style={{ width: 40 }} />
              </div>
              <iframe title='SSH Viewer' src={viewerURL} style={{ width: window.innerWidth, height: window.innerHeight, marginTop: -35 }} />
            </Modal>

            <Modal
              isOpen={credentials}
              style={customStyle}
              className='netmodal'
              ariaHideApp={false}
              onRequestClose={() => this.setState({ credentials: !credentials, username: null, password: null })}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold', color: '#f28e00' }}>Attention</span>
                <span style={{ width: 250, marginTop: 8, marginBottom: 10, fontSize: 13 }}>To ensure the {credentials} remote connection can be opened, you must run elemento-remote-tools beforehand.</span>
                <p className='loginregister' style={{ textAlign: 'center' }} onClick={() => this.openExternalLink()}>Download elemento-remote-tools here!</p>
              </div>

              <div className='stomodalinput'>
                <span>Username</span>
                <input type='text' value={username} onChange={e => this.setState({ username: e.target.value })} />
              </div>
              <div className='stomodalinput'>
                <span>Password</span>
                <input type='password' value={password} onChange={e => this.setState({ password: e.target.value })} />
              </div>

              {
                username && password &&
                  <div
                    className='stobutton'
                    onClick={async () => {
                      credentials === 'ssh' && await this.openSSHViewer()
                      credentials === 'vnc' && await this.openVNCViewer()
                      credentials === 'rdp' && await this.openRDPViewer()
                    }}
                  >
                    <span>Open Connection</span>
                  </div>
              }
            </Modal>
          </div>
        </div>

        <Daemons />
      </div>
    )
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '400px',
    height: '300px',
    border: '2px dashed #cccccc',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px'
  },
  browseStyle: {
    color: '#007bff',
    cursor: 'pointer'
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
  },
  outline: 'none'
}

export default VirtualMachineList
