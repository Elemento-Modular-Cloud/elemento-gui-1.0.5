import React, { Component } from 'reactn'
import { ReactComponent as Pc } from '../Assets/main/pc.svg'
import { persistState } from '../Services'
import './css/BillingModal.css'

class BillingModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showBilling: false,
      billingVisible: false,
      mesos: null
    }
  }

  componentDidMount () {
    if (this.global) {
      this.setState({ billingVisible: this.global.billingVisible })
    }
  }

  render () {
    const { showBilling, billingVisible } = this.state
    const { mesos, updated, detail } = this.props

    return (
      <div style={{ position: 'relative', backgroundColor: 'white' }}>
        <div
          className='resumebtn'
          onClick={() => {
            this.setState({ showBilling: !showBilling })
            this.props.setUpdated()
          }}
        >
          <Pc />
          Cost

          {updated && <div className='reddot'><div className='whitedot' /></div>}
        </div>
        <div className='billingBox' style={{ display: showBilling ? 'block' : billingVisible ? 'block' : 'none' }}>
          <div className='tickContainer'>
            <div className='tick' />
          </div>
          <div className='bContent'>
            <div className='bCheck'>
              <span>Always visible?</span>
              <input
                type='checkbox'
                checked={billingVisible}
                onChange={async e => {
                  const billingVisible = e.target.checked
                  this.setState({ billingVisible })
                  await this.setGlobal({ billingVisible }, persistState)
                }}
              />
            </div>
            <p className='bTitle'>Cost Details</p>
            <span><b>Hourly price</b></span> <br />
            <span>({detail.cores || 0} Cores, {detail.overprovision || 0} Overprovision, {detail.ramsize || 0} RAM)</span>
            <p style={{ textAlign: 'right', marginTop: -5 }}>{mesos ? mesos.price.hour : '0,00'} {mesos ? mesos.price.unit : 'USD'}</p>
            <span><b>Monthly price</b></span>
            <p style={{ textAlign: 'right', marginTop: -5 }}>{mesos ? mesos.price.month : '0,00'} {mesos ? mesos.price.unit : 'USD'}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default BillingModal
