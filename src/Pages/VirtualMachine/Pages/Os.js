import React, { Component } from 'reactn'
import { persistState } from '../../../Services'

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
      <div>
        <h2>Os selection</h2>
        <p>{os}</p>

        <button onClick={async () => await this.updateState('linux')}>Linux</button>
        <button onClick={async () => await this.updateState('windows')}>Windows</button>
        <button onClick={async () => await this.updateState('mac')}>Mac</button>

      </div>
    )
  }
}

export default Os
