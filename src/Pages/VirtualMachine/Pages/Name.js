import React, { Component } from 'reactn'
import { persistState } from '../../../Services'

class componentName extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  async componentDidMount () {
    const { advancedSetup } = this.global
    const name = advancedSetup.name || ''
    this.setState({ name })
  }

  async updateState (name) {
    const { advancedSetup } = this.global
    this.props.setName(name)
    await this.setGlobal({
      advancedSetup: { ...advancedSetup, name }
    }, persistState)
  }

  render () {
    const { name } = this.state

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ marginBottom: 50, fontSize: 25 }}>VM Name</span>
        <input
          type='text'
          value={name}
          style={{ height: 35, width: 250 }}
          onChange={async e => {
            this.setState({ name: e.target.value })
            await this.updateState(e.target.value)
          }}
        />
        <p>Only letters, number,- (dash) are permitted. Max lenght 15 chars.</p>
      </div>
    )
  }
}

export default componentName
