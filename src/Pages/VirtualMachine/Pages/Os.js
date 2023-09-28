import React, { Component } from 'reactn'
import { persistState } from '../../../Services'
import { CustomSelect } from '../../../Components'
import { ReactComponent as Windows } from '../../../Assets/os/windows.svg'
import { ReactComponent as Linux } from '../../../Assets/os/linux.svg'
// import { ReactComponent as Apple } from '../../../Assets/os/apple.svg'
import iso from '../../../Data/iso-templates/iso.json'
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

  async updateState (os, flavour) {
    const { advancedSetup } = this.global

    this.setState({ os })
    this.props.setOs({ os, flavour })

    await this.setGlobal({
      advancedSetup: {
        ...advancedSetup,
        os,
        flavour
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
            onClick={async () => await this.updateState('linux', null)}
            style={{ backgroundColor: os === 'linux' ? '#f28e00' : 'white' }}
          >
            <Linux fill={os === 'linux' ? 'white' : 'black'} />
          </div>
          <div
            className='osradioitem'
            onClick={async () => await this.updateState('windows', null)}
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
        <br />

        {
          os && (
            <>
              <span style={{ marginBottom: 10, fontWeight: 'bold' }}>OS Flavour</span>
              <CustomSelect
                options={iso.filter(j => j.os_family === os).map(i => i.os_flavour)}
                onChange={async (event, flavour) => {
                  if (flavour) {
                    await this.updateState(os, flavour)
                  }
                }}
              />
            </>
          )
        }
      </>
    )
  }
}

export default Os
