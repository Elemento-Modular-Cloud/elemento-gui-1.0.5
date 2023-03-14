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
      <div>
        <h2>Virtual Machine Name</h2>
        <input
          type='text'
          value={name}
          onChange={async e => {
            this.setState({ name: e.target.value })
            await this.updateState(e.target.value)
          }}
        />
        <p>Only letters, number,_,- are permitted.</p>
      </div>
    )
  }
}

export default componentName
