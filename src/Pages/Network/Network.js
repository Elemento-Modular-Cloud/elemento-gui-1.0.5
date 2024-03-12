import React, { Component } from 'react'
import Modal from 'react-modal'
import { Api } from '../../Services'
import { Config } from '../../Global'
import { Back, Loader, Sidebar } from '../../Components'
import { ReactComponent as Arrow } from '../../Assets/utils/arrow.svg'
import './Network.css'
import swal from 'sweetalert'

class Network extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      networks: [],
      ports: [],
      speed: '',
      showModal: false
    }
  }

  async componentDidMount () {
    await this.getNetworkList()
  }

  async getNetworkList () {
    this.setState({ loading: true })
    Api.createClient(Config.API_URL_NETWORK)
    const res = await Api.post('/list', {})

    if (res.ok) {
      this.setState({ networks: res.data })
    }
    this.setState({ loading: false })
  }

  async createNewNetwork () {
    const { ports, speed } = this.state

    Api.createClient(Config.API_URL_NETWORK)
    const res = await Api.post('/create', {
      ports, speed
    })

    if (res.ok) {
      swal('Success!', 'Network added successfully', 'success', {
        buttons: false,
        timer: 3000
      })
      await this.getNetworkList()
    } else {
      swal('Error', 'Could not add the network', 'error', {
        buttons: false,
        timer: 3000
      })
    }
    this.setState({ showModal: false })
  }

  render () {
    const { loading, showModal, networks } = this.state

    return (
      <div className='netpage'>
        <Sidebar selected='network' />
        <div className='lbody netbody'>
          <hr />

          <div className='netheader'>
            <span>Network</span>
            <Back page='/' refresh={async () => await this.getNetworkList()} />
          </div>

          {loading && <Loader />}

          <div className='netbtnnew' onClick={() => this.setState({ showModal: true })}>
            <div className='netbtncontainer'>
              <span>CREATE NEW NETWORK</span>
              <Arrow />
            </div>
          </div>

          <div className='nettables'>
            <table className='lictable'>
              <thead className='lictablehead'>
                <tr>
                  <td>Creator Id</td>
                  <td>Network Id</td>
                  <td>Name</td>
                  <td>Ports</td>
                  <td>Hostname</td>
                  <td>Overprovision</td>
                  <td>Private</td>
                  <td>Speed</td>
                </tr>
              </thead>
              <tbody className='lictablebody'>
                {
                  networks && networks.length > 0 && networks.map((network, i) => {
                    return (
                      <tr key={i}>
                        <td>{network.creatorID}</td>
                        <td>{network.network_id}</td>
                        <td>{network.name}</td>
                        <td>{network.hostname}</td>
                        <td>{network.overprovision}</td>
                        <td>{network.private}</td>
                        <td>{network.speed}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={showModal}
            style={customStyle}
            className='netmodal'
            ariaHideApp={false}
            onRequestClose={() => this.setState({ showModal: false })}
          >
            <h2>New network</h2>
            <span>Port</span>
            <br />
            <select onChange={e => this.setState({ ports: [e.target.value] })}>
              <option>...</option>
              <option value='80'>80</option>
              <option value='8080'>8080</option>
              <option value='3030'>3030</option>
              <option value='443'>443</option>
            </select>
            <br />
            <br />
            <span>Speed</span>
            <br />
            <select onChange={e => this.setState({ speed: e.target.value })}>
              <option>...</option>
              <option value='10 Mbit/s'>10 Mbit/s</option>
              <option value='1 Gbit/s'>1 Gbit/s</option>
              <option value='2.5 Gbit/s'>2.5 Gbit/s</option>
              <option value='5 Gbit/s'>5 Gbit/s</option>
              <option value='10 Gbit/s'>10 Gbit/s</option>
              <option value='25 Gbit/s'>25 Gbit/s</option>
              <option value='100 Gbit/s'>100 Gbit/s</option>
            </select>
            <br />
            <button className='netbtn' onClick={async () => await this.createNewNetwork()}>Create</button>
          </Modal>
        </div>
      </div>
    )
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
  }
}

export default Network
