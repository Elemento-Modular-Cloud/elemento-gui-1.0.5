import React, { Component } from 'reactn'
import { CustomAutocomplete, CustomSlider } from '../../../Components'
import { getArchs, getCPUInstructionExt, getCores, getCpuFrequency, getOverprovision } from '../../../Global/Model'
import { persistState } from '../../../Services'
import '../css/Pages.css'

const archs = getArchs()
const coresMarks = getCores()
const overprovisionMarks = getOverprovision()
const cpuFrequencyMarks = getCpuFrequency()

class Cpu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cores: 1,
      coresIndex: 0,
      overprovision: 1,
      overprovisionIndex: 0,
      cpuFrequency: '0.5',
      cpuFrequencyIndex: 0,
      archsList: [],
      flags: []
    }
  }

  async componentDidMount () {
    const { advancedSetup } = this.global
    const cores = advancedSetup.cores || 1
    const overprovision = advancedSetup.overprovision || 1
    const archsList = advancedSetup.archsList || [{ value: 'X86_64', checked: true }]
    const flags = advancedSetup.flags || []
    const cpuFrequency = advancedSetup.cpuFrequency || '0.5'

    const coresIndexes = coresMarks.filter(x => x.scaledValue === cores)
    const coresIndex = coresIndexes.length > 0 ? coresIndexes[0].value : 0
    const overprovisionIndexes = overprovisionMarks.filter(x => (x.value + 1) === overprovision)
    const overprovisionIndex = overprovisionIndexes.length > 0 ? overprovisionIndexes[0].value : 0
    const cpuFrequencyIndexes = cpuFrequencyMarks.filter(x => x.label === cpuFrequency)
    const cpuFrequencyIndex = cpuFrequencyIndexes.length > 0 ? cpuFrequencyIndexes[0].value : 0

    this.setState({
      cores,
      coresIndex,
      overprovision,
      overprovisionIndex,
      cpuFrequencyIndex,
      archsList,
      flags
    })

    await this.updateState(cores, overprovision, archsList, flags, cpuFrequency)
  }

  async updateState (cores, overprovision, archsList, flags, cpuFrequency) {
    const { advancedSetup } = this.global
    this.props.setCpu({
      cores,
      overprovision,
      cpuFrequency,
      archsList,
      flags
    })
    await this.setGlobal({
      advancedSetup: {
        ...advancedSetup,
        cores,
        overprovision,
        cpuFrequency,
        archsList,
        flags
      }
    }, persistState)
  }

  render () {
    const {
      cores, coresIndex,
      overprovision, overprovisionIndex,
      cpuFrequency, cpuFrequencyIndex,
      archsList, flags
    } = this.state

    const checked = (option) => {
      const { flags } = this.state
      return flags.indexOf(option) > -1
    }

    return (
      <div className='cpubody'>
        <span style={{ marginBottom: 50, fontSize: 25 }}>CPU Setup</span>
        <div className='cpuupper'>
          <div className='cpuleft'>
            CPU Cores: {cores}
            <CustomSlider
              value={coresIndex}
              step={1}
              marks={coresMarks}
              min={0}
              max={7}
              onChange={(e, i) => {
                this.setState({ coresIndex: i, cores: coresMarks[i].scaledValue })
                this.updateState(coresMarks[i].scaledValue, overprovision, archsList, flags, cpuFrequency)
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
                this.updateState(cores, overprovisionMarks[i].value + 1, archsList, flags, cpuFrequency)
              }}
            />
            <br />

            CPU Frequency: {cpuFrequency} GHz
            <CustomSlider
              defaultValue={0}
              value={cpuFrequencyIndex}
              step={1}
              marks={cpuFrequencyMarks}
              min={0}
              max={9}
              onChange={(e, i) => {
                this.setState({
                  cpuFrequencyIndex: i,
                  cpuFrequency: cpuFrequencyMarks[i].label
                })
                this.updateState(cores, overprovision, archsList, flags, cpuFrequencyMarks[i].label)
              }}
            />
          </div>
          <div className='cpuright'>
            <span className='cpucaption'>Desired architectures</span>
            <br />
            <div className='cpuarchs'>
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
                        this.updateState(cores, overprovision, updateList, flags, cpuFrequency)
                      }}
                    />
                  </div>
                )
              }
            </div>

            <span className='cpucaption'>CPU instruction set extensions</span>
            <CustomAutocomplete
              options={getCPUInstructionExt()}
              value={flags}
              checked={checked}
              onChange={(event, flags) => {
                this.setState({ flags })
                this.updateState(cores, overprovision, archsList, flags, cpuFrequency)
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Cpu
