import React, { Component } from 'reactn'
import { persistState } from '../../../Services'
import { ReactComponent as Windows } from '../../../Assets/os/windows.svg'
import { ReactComponent as Linux } from '../../../Assets/os/linux.svg'
import { ReactComponent as Apple } from '../../../Assets/os/apple.svg'
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
    return (
      <>
        <span style={{ marginBottom: 50, fontSize: 25 }}>OS Setup</span>
        <div className='osradio'>
          <span className='oscaption'>OS Selection*</span>
          <div className='osradioitem'>
            <input type='radio' id='linux' name='os' value='linux' onClick={async () => await this.updateState('linux')} />
            <Linux />
          </div>
          <div className='osradioitem'>
            <input type='radio' id='windows' name='os' value='windows' onClick={async () => await this.updateState('windows')} />
            <Windows />
          </div>
          <div className='osradioitem'>
            <input type='radio' id='mac' name='os' value='mac' onClick={async () => await this.updateState('mac')} />
            <Apple />
          </div>
        </div>
      </>
    )
  }
}

export default Os
