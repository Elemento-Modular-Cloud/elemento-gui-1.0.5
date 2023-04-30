import React, { Component } from 'reactn'
import { persistState } from '../../../Services'
import { ReactComponent as Windows } from '../../../Assets/os/windows.svg'
import { ReactComponent as Linux } from '../../../Assets/os/linux.svg'
// import { ReactComponent as Apple } from '../../../Assets/os/apple.svg'
import '../css/Pages.css'

class Os extends Component {
  constructor (props) {
    super(props)
    this.state = {
      os: ''
    }
  }

  async componentDidMount () {
    const { advancedSetup } = this.global
    const os = advancedSetup.os || ''
    this.setState({ os })
  }

  async updateState (os) {
    const { advancedSetup } = this.global

    this.setState({ os })
    this.props.setOs({ os })

    await this.setGlobal({
      advancedSetup: {
        ...advancedSetup,
        os
      }
    }, persistState)
  }

  render () {
    const { os } = this.state
    return (
      <>
        <span style={{ marginBottom: 50, fontSize: 25 }}>OS Setup</span>
        <div className='osradio'>
          <div
            className='osradioitem'
            onClick={async () => await this.updateState('linux')}
            style={{ backgroundColor: os === 'linux' ? '#f28e00' : 'white' }}
          >
            <Linux fill={os === 'linux' ? 'white' : 'black'} />
          </div>
          <div
            className='osradioitem'
            onClick={async () => await this.updateState('windows')}
            style={{ backgroundColor: os === 'windows' ? '#f28e00' : 'white' }}
          >
            <Windows fill={os === 'windows' ? 'white' : 'black'} />
          </div>
          {/* <div
            className='osradioitem'
            onClick={async () => await this.updateState('apple')}
            style={{ backgroundColor: os === 'apple' ? '#f28e00' : 'white' }}
          >
            <Apple fill={os === 'apple' ? 'white' : 'black'} />
          </div> */}
        </div>
      </>
    )
  }
}

export default Os
