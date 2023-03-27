import React, { Component } from 'reactn'
import { models, vendors } from '../../../Global/Model'
import { persistState } from '../../../Services'

const DEFAULT_NONE_ID = '0000'

class Pci extends Component {
  constructor (props) {
    super(props)

    this.state = {
      vendorId: DEFAULT_NONE_ID,
      modelId: DEFAULT_NONE_ID,
      pci: []
    }
  }

  async componentDidMount () {
    const { advancedSetup } = this.global
    const pci = advancedSetup.pci || []

    this.setState({ pci })
  }

  async addPci () {
    try {
      const { vendorId, modelId, pci } = this.state
      const pcis = [
        ...pci,
        {
          vendorId,
          vendor: vendors[Object.keys(vendors).filter(item => item === vendorId)[0]],
          modelId,
          model: models[Object.keys(models).filter(item => item === vendorId)].filter(item => item[1] === modelId)[0][0],
          quantity: 1
        }
      ]
      this.setState({ pci: pcis })
      await this.updateState(pcis)
    } catch (error) {
      window.alert('Error during model selection, please select it again')
    }
  }

  removePci (modelId) {
    const { pci } = this.state
    const pcis = pci.filter(item => item.modelId !== modelId)
    this.setState({ pci: pcis })
  }

  async updateState (pci) {
    const { advancedSetup } = this.global
    this.props.setPci({
      pci
    })
    await this.setGlobal({
      advancedSetup: {
        ...advancedSetup,
        pci
      }
    }, persistState)
  }

  render () {
    const { vendorId, pci } = this.state

    return (
      <div>
        <h2>Pci setup</h2>

        <h3>Vendor</h3>
        <select onChange={e => this.setState({ vendorId: e.target.value })}>
          {
            vendors && Object.keys(vendors).sort((a, b) => a - b).map((item, i) =>
              <option key={i} value={item}>{vendors[item]}</option>)
          }
        </select>
        <br />

        {
          vendorId !== DEFAULT_NONE_ID &&
            <div>
              <h3>Model</h3>
              <select onChange={e => this.setState({ modelId: e.target.value })}>
                <option value={DEFAULT_NONE_ID}>None</option>
                {
                  models && models[Object.keys(models).filter(item => item === vendorId)[0]].map((item, i) =>
                    <option key={i} value={item[1]}>{item[0]}</option>)
                }
              </select>
              <br />
              <br />

              <button onClick={async () => await this.addPci()}>Add</button>
            </div>
        }
        <br />
        <br />

        <table>
          <thead>
            <tr>
              <td>Vedor ID</td>
              <td>Vedor</td>
              <td>Model ID</td>
              <td>Model</td>
              <td>Delete</td>
            </tr>
          </thead>
          <tbody>
            {
              pci && pci.length > 0 && pci.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.vendorId}</td>
                    <td>{item.vendor}</td>
                    <td>{item.modelId}</td>
                    <td>{item.model}</td>
                    <td>
                      <button onClick={() => this.removePci(item.modelId)}>Delete</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Pci
