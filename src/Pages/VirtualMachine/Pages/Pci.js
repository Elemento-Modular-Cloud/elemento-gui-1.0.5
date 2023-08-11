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
    await this.updateState([])
  }

  async addPci (modelId) {
    try {
      const { vendorId, pci } = this.state // modelId
      if (pci.filter(p => p.modelId === modelId).length > 0) { return }

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
      swal('Error', 'Error during model selection, please select it again', 'error', {
        buttons: false,
        timer: 3000
      })
    }
  }

  async removePci (modelId) {
    const { pci } = this.state
    const pcis = pci.filter(item => item.modelId !== modelId)
    this.setState({ pci: pcis })
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

  render () {
    const { vendorId, pci } = this.state

    return (
      <div>
        <h2>Pci setup</h2>
        <p>ⓘ Be aware that certain hosts may require to add both video and audio card or may add both of them automatically</p>

        <div className='pciselectors'>
          <div className='pciselectvendor'>
            <h3>Vendor</h3>
            <CustomSelect
              style={{ windth: '100%' }}
              options={Object.keys(vendors).sort((a, b) => a - b).map(item => `${item} @ ${vendors[item]}`)}
              onChange={(event, vendor) => {
                if (vendor) {
                  const splitted = vendor.split(' @ ')
                  const vendorId = splitted[0]
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
                  options={models[Object.keys(models).filter(item => item === vendorId)[0]].map(item => `${item[1]} @ ${item[0]}`)}
                  onChange={async (event, model) => {
                    if (model) {
                      const splitted = model.split(' @ ')
                      const modelId = splitted[0]
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
