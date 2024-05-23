import React, { Component } from 'reactn'
import { CustomSlider } from '../../../Components'
import { persistState } from '../../../Services'
import { getMemories } from '../../../Global/Model'
import '../css/Pages.css'

const marks = getMemories()

class Cpu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      size: '250MB',
      ecc: false,
      value: 0
    }
  }

  async componentDidMount () {
    const { advancedSetup } = this.global
    const size = advancedSetup.size || marks[0].label || this.state.size
    const ecc = advancedSetup.ecc || 0
    this.setState({
      size,
      ecc,
      value: marks.filter(x => x.label === size)[0].value
    })
    await this.updateState(size, ecc)
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
      <div className='membody'>
        <span style={{ marginBottom: 50, fontSize: 25 }}>Memory Setup</span>
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

        <div className='memecc'>
          <h3>ECC?</h3>
          <input
            type='checkbox'
            checked={ecc}
            onChange={async e => {
              this.setState({ ecc: e.target.checked })
              this.updateState(size, e.target.checked)
            }}
          />
          <span onClick={() => this.setState({ ecc: !ecc })}>Select this to enable ECC (Error-Correcting Code) memory. This particular kind of memory detects and corrects errors in data stored in computer memory to prevent data corruption.</span>
        </div>
      </div>
    )
  }
}

export default Cpu
