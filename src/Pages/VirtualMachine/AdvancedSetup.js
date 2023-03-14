import React, { Component } from 'reactn'
import { Cpu, Memory, Name } from './Pages'
import { persistState } from '../../Services'

const NAME_PAGE = 1
const CPU_PAGE = 2
const MEMORY_PAGE = 3

class AdvancedSetup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      name: '',
      cpu: {
        cores: 0,
        overprovision: 0,
        archsList: [],
        flags: []
      },
      memory: {
        size: 0,
        ecc: false
      }
    }
  }

  async componentDidMount () {
    await this.setGlobal({ advancedSetup: {} }, persistState)
  }

  previous () {
    const { page } = this.state
    this.setState({ page: (page - 1) >= 1 ? (page - 1) : 1 })
  }

  next () {
    const { page, name, cpu, memory } = this.state

    let next = true

    if (page === NAME_PAGE) {
      if (!/^[a-zA-Z0-9_-]*$/.test(name)) {
        window.alert('wrong vm name')
        next = false
      }
    } else if (page === CPU_PAGE) {
      const { cores, overprovision, archsList } = cpu
      if (cores <= 0 || cores > 8) {
        window.alert('Please, select at least 1 core')
        next = false
      } else if (overprovision <= 0 || overprovision > 8) {
        window.alert('Please, select at least 1 overprovision')
        next = false
      } else if (archsList.length === 0) {
        window.alert('Please, select at least 1 architecture')
        next = false
      }
    } else if (page === MEMORY_PAGE) {
      console.log(memory)
      next = false
    }

    next && this.setState({ page: (page + 1) <= 8 ? (page + 1) : 8 })
  }

  render () {
    const { page } = this.state
    const { body } = styles

    return (
      <div>
        <a href='/newvm'>Back</a>
        <h1>Advanced setup ({page}/8)</h1>

        <div style={body}>
          {page === 1 && <Name setName={name => this.setState({ name })} />}
          {page === 2 && <Cpu setCpu={cpu => this.setState({ cpu })} />}
          {page === 3 && <Memory setMemory={memory => this.setState({ memory })} />}
        </div>
        <div>
          <button onClick={() => this.previous()}>Previous</button>
          <button onClick={() => this.next()}>Next</button>
        </div>
      </div>
    )
  }
}

const styles = {
  body: {
    height: 600
  }
}

export default AdvancedSetup
