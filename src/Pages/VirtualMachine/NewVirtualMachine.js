import React, { Component } from 'reactn'
import { persistState } from '../../Services'
import { Button } from '../../Components'

class VirtualMachine extends Component {
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
    const { page, body } = styles

    return (
      <div style={page}>
        <div style={body}>
          <a href='/vm'>Back</a>
          <h1>Create new Virtual Machine</h1>

          <Button name='Basic setup' page='/newvm/basic' />
          <Button name='Advanced setup' page='/newvm/advanced' />
        </div>
      </div>
    )
  }
}

const styles = {
  page: {
  },
  body: {
  }
}

export default VirtualMachine
