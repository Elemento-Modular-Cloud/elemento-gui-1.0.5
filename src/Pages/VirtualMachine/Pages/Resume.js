import React, { Component } from 'reactn'
import Modal from 'react-modal'
import swal from 'sweetalert'
import { ReactComponent as CheckGreen } from '../../../Assets/utils/checkgreen.svg'
import { ReactComponent as CheckRed } from '../../../Assets/utils/checkred.svg'
import { Config, Utils } from '../../../Global'
import { Loader } from '../../../Components'
import { ReactComponent as AtomOS } from '../../../Assets/atomos.svg'
import google from '../../../Assets/google.png'
import ovh from '../../../Assets/ovh.png'
import upcloud from '../../../Assets/upcloud.png'
import aws from '../../../Assets/aws.png'
import aruba from '../../../Assets/aruba.png'
import azure from '../../../Assets/azure.png'
import { Api } from '../../../Services'
import { getMemories } from '../../../Global/Model'
import '../css/Pages.css'

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

const validateIPv4 = (ip) => {
  return ipv4Regex.test(ip)
}

class Resume extends Component {
  constructor (props) {
    super(props)
    this.state = {
      advancedSetup: null,
      compactName: '',
      loading: false,
      allocate: null,
      provider: 'elemento',
      ipModal: false,
      ipv4: ''
    }
  }

  async componentDidMount () {
    const { advancedSetup } = this.global
    const compactName = Utils.compactString(advancedSetup.name)
    this.setState({ advancedSetup, compactName })
    await this.canAllocate()
  }

  async canAllocate () {
    const { advancedSetup } = this.global
    const {
      // name,
      cores: slots,
      cpuFrequency,
      overprovision,
      archsList,
      flags,
      allowSMT,
      size,
      ecc: reqECC,
      os,
      flavour,
      // volumeIds: volumes,
      pci
    } = advancedSetup

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

    const data = {
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
    }

    Api.createClient(Config.API_URL_MATCHER)
    const res = await Api.post('/canallocate', data)

    if (res.ok) {
      this.setState({ allocate: res.data })
    } else {
      console.log('cannot execute correctly /canallocate', res)
    }
  }

  render () {
    const { hideButtons, hideProviders, hideBottomBar } = this.props
    const { advancedSetup: x, compactName, loading, allocate, ipModal, ipv4 } = this.state

    if (!x) { return (<p>Error</p>) }

    return (
      <div className='resbody'>
        <div className='rescontent'>
          <div className='restoplogo' style={{ backgroundColor: Utils.toRGB(compactName) }}>
            <div className='reslogo'>
              <div className='resspec'><span>{x.cores}C</span><span>{x.size}</span></div><br />
              <span className='resspectitle'>{compactName}</span><br />
              <span className='resspecname'>{x.name}</span>
            </div>
          </div>

          <div className='resitems'>
            <div className='resitembox'>
              <span className='resitemtitle'>Name</span><span className='resitemvalue'>{x.name}</span>
            </div>
            <div className='resitembox'>
              <span className='resitemtitle'>Cores</span><span className='resitemvalue'>{x.cores}</span>
            </div>
            <div className='resitembox'>
              <span className='resitemtitle'>Overprovision</span><span className='resitemvalue'>{x.overprovision}</span>
            </div>
            <div className='resitembox'>
              <span className='resitemtitle'>Minimum Frequency</span><span className='resitemvalue'>{x.cpuFrequency || 0} GHz</span>
            </div>
            <div className='resitembox'>
              <span className='resitemtitle'>Architectures</span><span className='resitemvalue'>{x.archsList && x.archsList.lenght > 0 ? x.archsList.map(arch => arch.value).join(', ') : 'None'}</span>
            </div>
            <div className='resitembox'>
              <span className='resitemtitle'>Flags</span><span className='resitemvalue'>{x.flags ? x.flags.join(', ') : 'None'}</span>
            </div>
          </div>
          <div className='resitems'>
            <div className='resitembox'>
              <span className='resitemtitle'>Memory</span><span className='resitemvalue'>{x.size}</span>
            </div>
            <div className='resitembox'>
              <span className='resitemtitle'>ECC RAM</span><span className='resitemvalue'>{x.ecc ? <CheckGreen style={{ width: 30, height: 30 }} /> : <CheckRed style={{ width: 30, height: 30 }} />}</span>
            </div>
            <div className='resitembox'>
              <span className='resitemtitle'>O.S.</span><span className='resitemvalue' style={{ textTransform: 'capitalize' }}>{x.os} ({x.flavour})</span>
            </div>

            <div className='resitembox'>
              <span className='resitemtitle'>Volumes</span><span className='resitemvalue'>{x.volumeIds && x.volumeIds.length > 0 ? x.volumeIds.map(vol => vol.vid).join(', ') : 'None'}</span>
            </div>
            <div className='resitembox'>
              <span className='resitemtitle'>PCI</span><span className='resitemvalue'>{x.pci && x.pci.length > 0 ? x.pci.map(pci => `(x${pci.quantity}) ${pci.vendor} - ${pci.model}`).join(', ') : 'None'}</span>
            </div>
          </div>
        </div>

        <div className='resprices' style={{ display: hideProviders ? 'none' : 'flex' }}>
          <div className='respriceitem'>
            <><AtomOS style={{ width: 60, height: 60, position: 'absolute', top: 10, right: 10 }} /><br /></>
            <span style={{ fontWeight: 'bold' }}>On Premises</span><br /><br />

            <span>Hourly:  0,00 EUR</span><br />
            <span>Monthly: 0,00 EUR</span><br /><br /><br /><br />

            {
              this.state.provider === 'elemento'
                ? (
                  <button
                    className='resbtnwhite'
                  >
                    Selected ✓
                  </button>
                  )
                : (
                  <button
                    className='resbtn'
                    onClick={async () => this.setState({ provider: 'elemento' })}
                  >
                    Select
                  </button>
                  )
            }
            <br />
          </div>
          {
            allocate && allocate.mesos && allocate.mesos.length > 0 && allocate.mesos.map((mesos, i) => {
              const provider = mesos.provider
              const monthly = mesos.price.month
              const hourly = mesos.price.hour
              const unit = mesos.price.unit
              return (
                <div className={this.state.provider === provider ? 'respriceitem respriceitem_inverted' : 'respriceitem'} key={i}>
                  {provider === 'google' && <><img src={google} alt='' style={{ width: 45, height: 45 }} /><br /></>}
                  {provider === 'aws' && <><img src={aws} alt='' style={{ width: 60, height: 40, marginTop: 10, marginRight: 10 }} /><br /></>}
                  {provider === 'ovh' && <><img src={ovh} alt='' style={{ width: 70, height: 50 }} /><br /></>}
                  {provider === 'upcloud' && <><img src={upcloud} alt='' style={{ width: 70, height: 60 }} /><br /></>}
                  {provider === 'aruba' && <><img src={aruba} alt='' style={{ width: 80, height: 45 }} /><br /></>}
                  {provider === 'azure' && <><img src={azure} alt='' style={{ width: 90, height: 30 }} /><br /></>}

                  {provider === 'google' && <><span style={{ fontWeight: 'bold' }}>Google Cloud</span><br /><br /></>}
                  {provider === 'aws' && <><span style={{ fontWeight: 'bold' }}>AWS</span><br /><br /></>}
                  {provider === 'ovh' && <><span style={{ fontWeight: 'bold' }}>OVHcloud</span><br /><br /></>}
                  {provider === 'upcloud' && <><span style={{ fontWeight: 'bold' }}>UpCloud</span><br /><br /></>}
                  {provider === 'aruba' && <><span style={{ fontWeight: 'bold' }}>aruba Cloud</span><br /><br /></>}
                  {provider === 'azure' && <><span style={{ fontWeight: 'bold' }}>Microsoft Azure</span><br /><br /></>}

                  <span>Hourly:  {hourly || '0,00'} {unit || 'USD'}</span><br />
                  <span>Monthly: {monthly || '0,00'} {unit || 'USD'}</span><br /><br /><br /><br />

                  {
                    this.state.provider === provider
                      ? (
                        <button
                          className='resbtnwhite'
                        >
                          Selected ✓
                        </button>
                        )
                      : (
                        <button
                          className='resbtn'
                          onClick={async () => this.setState({ provider })}
                        >
                          Select
                        </button>
                        )
                  }
                  <br />
                </div>
              )
            })
          }
        </div>

        <div className='advtools' style={{ display: hideBottomBar ? 'none' : 'flex' }}>
          {!loading && !hideButtons &&
            <button
              className='advprevious'
              onClick={async () => {
                await this.props.back()
              }}
            >
              Previous
            </button>}
          {
            !loading &&
              <button
                className='advprevious'
                onClick={() => {
                  if (allocate && allocate.mesos && allocate.mesos.length > 0) {
                    let lowestProvider = allocate.mesos[0]

                    allocate.mesos.forEach(provider => {
                      if (provider.price.month < lowestProvider.price.month) {
                        lowestProvider = provider
                      }
                    })
                    this.setState({ provider: lowestProvider.provider })
                  }
                }}
                style={{ marginRight: 10 }}
              >
                Highlight the best ✓
              </button>
          }
          {!loading && !hideButtons &&
            <button
              className='btnregister'
              style={{ marginRight: 20 }}
              onClick={async () => {
                if (this.state.provider === 'elemento') {
                  this.setState({ ipModal: true })
                } else {
                  this.setState({ loading: true })
                  await this.props.register({ provider: this.state.provider, ipv4 })
                  this.setState({ loading: false })
                }
              }}
            >
              Register
            </button>}
        </div>
        {
          loading &&
            <div style={{ position: 'absolute', bottom: 30, right: 50 }}>
              <Loader style={{ height: 90, marginBottom: 10 }} />
            </div>
        }

        <Modal
          isOpen={ipModal}
          style={customStyle}
          className='netmodal'
          ariaHideApp={false}
          onRequestClose={() => this.setState({ ipModal: !ipModal })}
        >
          <AtomOS style={{ width: 80, height: 80, marginBottom: 20 }} />
          <span style={{ fontSize: 16 }}>Please, provide IPv4 address<br />for On Premises server</span>
          <input
            type='text'
            value={ipv4}
            style={{ width: 200, height: 30, marginTop: 20 }}
            onChange={(e) => {
              this.setState({ ipv4: e.target.value })
            }}
            placeholder='Enter IPv4 address'
          />
          <button
            className='btnregister'
            style={{ marginTop: 20 }}
            onClick={async () => {
              if (validateIPv4(ipv4)) {
                this.setState({ loading: true })
                await this.props.register({ provider: this.state.provider })
                this.setState({ loading: false })
              } else {
                swal('Error', 'One or more IPv4 addresses are not in the correct format (eg. 192.168.1.1)', 'error', {
                  buttons: false,
                  timer: 2500
                })
              }
            }}
          >
            Continue
          </button>
        </Modal>
      </div>
    )
  }
}

const customStyle = {
  content: {
    width: 230,
    height: 250,
    padding: 20,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    position: 'absolute',
    zIndex: 99999,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  outline: 'none'
}

export default Resume
