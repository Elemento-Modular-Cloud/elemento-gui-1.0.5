import React, { Component } from 'reactn'
import { CustomAutocomplete, CustomSlider } from '../../../Components'
import { getArchs, getCPUInstructionExt, getCores, getOverprovision } from '../../../Global/Model'
import { persistState } from '../../../Services'

const archs = getArchs()
const coresMarks = getCores()
const overprovisionMarks = getOverprovision()

class Cpu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cores: 0,
      coresIndex: 0,
      overprovision: 0,
      overprovisionIndex: 0,
      archsList: [],
      flags: []
    }
  }

  async componentDidMount () {
    const { advancedSetup } = this.global
    const cores = advancedSetup.cores || 0
    const overprovision = advancedSetup.overprovision || 0
    const archsList = advancedSetup.archsList || []
    const flags = advancedSetup.flags || []
    this.setState({
      cores,
      coresIndex: coresMarks.filter(x => x.scaledValue === cores)[0].value,
      overprovision,
      overprovisionIndex: overprovisionMarks.filter(x => (x.value + 1) === overprovision)[0].value,
      archsList,
      flags
    })
  }

  async updateState (cores, overprovision, archsList, flags) {
    const { advancedSetup } = this.global
    this.props.setCpu({
      cores,
      overprovision,
      archsList,
      flags
    })
    await this.setGlobal({
      advancedSetup: {
        ...advancedSetup,
        cores,
        overprovision,
        archsList,
        flags
      }
    }, persistState)
  }

  render () {
    const {
      cores, coresIndex,
      overprovision, overprovisionIndex,
      archsList, flags
    } = this.state

    const checked = (option) => {
      const { flags } = this.state
      return flags.indexOf(option) > -1
    }

    return (
      <div>
        CPU Cores: {cores}
        <CustomSlider
          value={coresIndex}
          step={1}
          marks={coresMarks}
          min={0}
          max={7}
          onChange={(e, i) => {
            this.setState({ coresIndex: i, cores: coresMarks[i].scaledValue })
            this.updateState(coresMarks[i].scaledValue, overprovision, archsList, flags)
          }}
        />
        <br />

        Max Overprovision: {overprovision}
        <CustomSlider
          defaultValue={0}
          value={overprovisionIndex}
          step={1}
          marks={overprovisionMarks}
          min={0}
          max={7}
          scale={(x) => 1 ** x}
          onChange={(e, i) => {
            this.setState({
              overprovisionIndex: i,
              overprovision: overprovisionMarks[i].value + 1
            })
            this.updateState(cores, overprovisionMarks[i].value + 1, archsList, flags)
          }}
        />
        <br />

        <h2>Desired architectures</h2>
        {
          archs && archs.length > 0 && archs.map((arch, i) =>
            <div key={i}>
              <span>{arch}</span>
              <input
                type='checkbox'
                value={arch}
                checked={archsList.filter(x => x.value === arch && x.checked).length >= 1}
                onChange={async e => {
                  const checked = e.target.checked
                  const value = e.target.value
                  let updateList = []

                  if (checked) {
                    updateList = [...archsList, { value, checked }]
                  } else {
                    updateList = [...archsList.filter(item => item.value !== value)]
                  }

                  this.setState({ archsList: updateList })
                  this.updateState(cores, overprovision, updateList, flags)
                }}
              />
            </div>
          )
        }

        <br />

        <h2>CPU instruction set extensions</h2>
        <CustomAutocomplete
          options={getCPUInstructionExt()}
          value={flags}
          checked={checked}
          onChange={(event, flags) => {
            this.setState({ flags })
            this.updateState(cores, overprovision, archsList, flags)
          }}
        />
      </div>
    )
  }
}

export default Cpu
