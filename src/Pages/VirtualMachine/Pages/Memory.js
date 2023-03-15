import React, { Component } from 'reactn'
import { CustomSlider } from '../../../Components'
import { persistState } from '../../../Services'
import { getMemories } from '../../../Global/Model'
const marks = getMemories()

class Cpu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      size: 0,
      ecc: false,
      value: 0
    }
  }

  async componentDidMount () {
    const { advancedSetup } = this.global
    const size = advancedSetup.size || marks[0].label
    const ecc = advancedSetup.ecc || 0
    this.setState({
      size,
      ecc,
      value: marks.filter(x => x.label === size)[0].value
    })
  }

  async updateState (size, ecc) {
    const { advancedSetup } = this.global
    this.props.setMemory({
      size, ecc
    })
    await this.setGlobal({
      advancedSetup: {
        ...advancedSetup,
        size,
        ecc
      }
    }, persistState)
  }

  render () {
    const { size, ecc, value } = this.state

    return (
      <div>
        <h2>Memory setup</h2>
        <p>{size}</p>

        <CustomSlider
          value={value}
          marks={marks}
          step={1}
          min={0}
          max={12}
          onChange={(e, size) => {
            if (typeof size === 'number') {
              this.setState({ value: size, size: marks[size].label })
              this.updateState(marks[size].label, ecc)
            }
          }}
        />

        <h3>ECC?</h3>
        <input
          type='checkbox'
          checked={ecc}
          onChange={async e => {
            this.setState({ ecc: e.target.checked })
            this.updateState(size, e.target.checked)
          }}
        />
      </div>
    )
  }
}

export default Cpu
