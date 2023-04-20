import React, { Component } from 'reactn'
import { persistState } from '../../Services'
import { Button, ButtonBlack, ButtonOrange, Sidebar } from '../../Components'
import { ReactComponent as AdminPanel } from '../../Assets/utils/adminpanel.svg'
import { ReactComponent as Playlist } from '../../Assets/utils/playlist.svg'

class VirtualMachineNew extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  async componentDidMount () {
    await this.getStatus()
    await this.setGlobal({ advancedSetup: {} }, persistState)
  }

  async getStatus () {
    // Api.createClient(Config.API_URL_MATCHER)
    // const res = await Api.get('/status', {})

    // if (res.ok) {
    //   this.setState({ vms: res.data })
    // } else {
    //   window.alert('Could not load vms')
    // }
  }

  render () {
    return (
      <div className='vmpage'>
        <Sidebar selected='vms' />
        <div className='vmbody'>
          <hr />

          <div className='vmheader'>
            <span>Virtual Machines</span>
            <a href='/'>Back</a>
          </div>

          <div className='vmbuttons'>
            <ButtonOrange Icon={Playlist} isOrange page='/newvm/basic' name='BASIC' text='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
            <div style={{ marginLeft: 80 }} />
            <ButtonBlack Icon={AdminPanel} page='/newvm/advanced' name='ADVANCED' text='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
          </div>
        </div>
      </div>
    )
  }
}

export default VirtualMachineNew
