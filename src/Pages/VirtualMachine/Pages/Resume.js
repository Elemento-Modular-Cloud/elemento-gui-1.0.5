import React, { Component } from 'reactn'
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
import '../css/Pages.css'
import { Api } from '../../../Services'
import { getMemories } from '../../../Global/Model'

class Resume extends Component {
  constructor (props) {
    super(props)
    this.state = {
      advancedSetup: null,
      compactName: '',
      loading: false,
      allocate: null,
      provider: null
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
    const { advancedSetup: x, compactName, loading, allocate } = this.state

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
              <span className='resitemtitle'>Frequency</span><span className='resitemvalue'>{x.cpuFrequency} GHz</span>
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

        <div className='resprices'>
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

        <div className='resbuttons'>
          {!loading && !this.props.hideButtons &&
            <button
              className='advprevious'
              onClick={async () => {
                await this.props.back()
              }}
            >
              Previous
            </button>}
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
          {!loading && !this.props.hideButtons &&
            <button
              className='btnregister'
              onClick={async () => {
                this.setState({ loading: true })
                await this.props.register({ provider: this.state.provider })
                this.setState({ loading: false })
              }}
            >
              Register
            </button>}
          {loading && <Loader />}
        </div>
      </div>
    )
  }
}

export default Resume
