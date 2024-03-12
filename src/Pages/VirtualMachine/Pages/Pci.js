import React, { Component } from 'reactn'
import { models, vendors } from '../../../Global/Model'
import { persistState } from '../../../Services'
import { CustomSelect } from '../../../Components'
import '../css/Pages.css'
import swal from 'sweetalert'

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
    await this.updateState(pci)
  }

  sortPci (pci) {
    if (pci && pci.length > 0) {
      return pci.sort((a, b) => a.vendorId.localeCompare(b.vendorId) || a.modelId.localeCompare(b.modelId))
    }
    return []
  }

  async addPci (modelId) {
    try {
      let added = {}

      const { vendorId, pci } = this.state // modelId
      const found = pci.filter(p => p.modelId === modelId)
      if (found.length > 0) {
        added = {
          ...found[0],
          quantity: found[0].quantity + 1
        }
      } else {
        const vendor = vendors[Object.keys(vendors).filter(item => item === vendorId)[0]]
        const model = models[Object.keys(models).filter(item => item === vendorId)].filter(item => item[1] === modelId)[0][0]
        added = {
          vendorId,
          vendor,
          modelId,
          model,
          quantity: 1
        }
      }

      const pcis = [...pci.filter(p => p.modelId !== modelId), added]

      this.setState({ pci: this.sortPci(pcis) })
      await this.updateState(pcis)
    } catch (error) {
      swal('Error', 'Error during model selection, please select it again', 'error', {
        buttons: false,
        timer: 3000
      })
    }
  }

  async removePci (modelId) {
    const { pci } = this.state
    const pcis = pci.filter(item => item.modelId !== modelId)
    this.setState({ pci: this.sortPci(pcis) })
    await this.updateState(pcis)
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

  async decreaseQuantity (vendorId, modelId) {
    const { pci } = this.state
    let updated = []

    const selected = pci.filter(p => p.vendorId === vendorId && p.modelId === modelId)[0]
    const others = pci.filter(p => p.vendorId !== vendorId || p.modelId !== modelId)

    if (selected.quantity > 1) {
      updated = [
        ...others,
        {
          ...selected,
          quantity: selected.quantity - 1
        }
      ]
    } else {
      await this.removePci(modelId)
      updated = others
    }
    updated = this.sortPci(updated)

    await this.updateState(updated)
    this.setState({ pci: updated })
  }

  async increaseQuantity (vendorId, modelId) {
    const { pci } = this.state

    const selected = pci.filter(p => p.vendorId === vendorId && p.modelId === modelId)[0]
    const others = pci.filter(p => p.vendorId !== vendorId || p.modelId !== modelId)
    let updated = [
      ...others,
      {
        ...selected,
        quantity: selected.quantity + 1
      }
    ]
    updated = this.sortPci(updated)

    await this.updateState(updated)
    this.setState({ pci: updated })
  }

  render () {
    const { vendorId, pci } = this.state

    return (
      <div className='advmain'>
        <h2>Pci setup</h2>
        <p>ⓘ Be aware that certain hosts may require to add both video and audio card or may add both of them automatically</p>

        <div className='pciselectors'>
          <div className='pciselectvendor'>
            <h3>Vendor</h3>
            <CustomSelect
              style={{ windth: '100%' }}
              options={Object.keys(vendors).sort((a, b) => a - b).map(item => vendors[item])}
              onChange={(event, vendor) => {
                if (vendor) {
                  const vendorId = Object.keys(vendors).filter(item => vendors[item] === vendor)[0]
                  this.setState({ vendorId })
                }
              }}
            />
          </div>

          {
            vendorId !== DEFAULT_NONE_ID &&
              <div className='pciselectmodel'>
                <h3>Model</h3>
                <CustomSelect
                  options={models[Object.keys(models).filter(item => item === vendorId)[0]].map(item => `${item[0]} → ${item[1]}`)}
                  onChange={async (event, model) => {
                    if (model) {
                      const modelId = model.split(' → ')[1]
                      this.setState({ modelId })
                      await this.addPci(modelId)
                    }
                  }}
                />
              </div>
          }
        </div>

        {
          pci && pci.length > 0 &&
            <table className='pcitable'>
              <thead>
                <tr>
                  <td>Vedor ID</td>
                  <td>Vedor</td>
                  <td>Model ID</td>
                  <td>Model</td>
                  <td>Quantity</td>
                  <td>Remove</td>
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
                          <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div
                              onClick={() => this.decreaseQuantity(item.vendorId, item.modelId)}
                              style={{ backgroundColor: 'lightgray', width: 20, height: 20, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, cursor: 'pointer' }}
                            >
                              -
                            </div>
                            {item.quantity}
                            <div
                              onClick={() => this.increaseQuantity(item.vendorId, item.modelId)}
                              style={{ backgroundColor: 'lightgray', width: 20, height: 20, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 10, cursor: 'pointer' }}
                            >
                              +
                            </div>
                          </div>
                        </td>
                        <td>
                          <button className='bn632-hover bn28' onClick={async () => await this.removePci(item.modelId)}>Remove</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
        }
      </div>
    )
  }
}

export default Pci
