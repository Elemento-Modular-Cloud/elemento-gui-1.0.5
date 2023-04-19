import React, { Component } from 'reactn'
import { Api, persistState } from '../Services'
import { Config } from '../Global'

class Setup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      checkServices: false,
      requirements: false,
      missingRequirements: false,
      installation: false,
      servicesInstalled: false
    }
  }

  async componentDidMount () {
    // await this.checkServicesInstalled()
    console.log('setup')
    await this.setGlobal({ setup: true }, persistState)
    await this.props.postSetup()
  }

  wait (milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  async checkServicesInstalled () {
    await this.wait(2000)

    Api.createClient(Config.API_INTERNALSVC)
    const res = await Api.get('/services/installed')

    if (res.ok && res.data.servicesInstalled) {
      await this.setGlobal({ setup: true }, persistState)
      this.setState({ servicesInstalled: true, step: 5 })
    } else {
      this.setState({ checkServices: true })
    }
  }

  async checkRequirements () {
    this.setState({ step: 2, requirements: false, missingRequirements: false })
    await this.wait(2000)

    Api.createClient(Config.API_INTERNALSVC)
    const res = await Api.get('/services/requirements')

    if (res.ok && res.data.requirementsInstalled) {
      this.setState({ requirements: true, step: 3 })
    } else {
      this.setState({ requirements: true, missingRequirements: true })
    }
  }

  async installServices () {
    this.setState({ step: 4, installation: true })

    Api.createClient(Config.API_INTERNALSVC)
    const res = await Api.get('/services/install')
    if (res.ok && res.data.servicesInstalled) {
      await this.setGlobal({ setup: true }, persistState)
      this.setState({ servicesInstalled: true, step: 5 })
    } else {
      this.setState({ servicesInstalled: false, step: 5 })
    }
  }

  render () {
    const { step, checkServices, requirements, missingRequirements, installation, servicesInstalled } = this.state

    return (
      <div>
        <h1>Setup screen</h1>

        {
          step === 1 && !checkServices &&
            <div>
              <p>Checking if services are installed...</p>
              <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>
            </div>
        }

        {
          step === 1 && checkServices &&
            <div>
              <p>Elemento Cloud services are not installed. Please install them before to proceed.</p>
              <p>ATTENTION: there are few requirements to satisfy before to run the installation process</p>
              <ul>
                <li>Node JS - v18.0.0</li>
                <li>Docker desktop - latest version</li>
              </ul>
              <button onClick={async () => await this.checkRequirements()}>Check requirements</button>
            </div>
        }

        {
          step === 2 && !requirements &&
            <div>
              <p>Requirements check in progress, please wait a while...</p>
              <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>
            </div>
        }

        {
          step === 2 && missingRequirements &&
            <div>
              <p>Requirements are not satisfied. Please install the required third party software before to continue.</p>
              <ul>
                <li>Node JS - v18.0.0</li>
                <li>Python - v3</li>
                <li>Docker desktop - last version</li>
              </ul>
              <button onClick={async () => await this.checkRequirements()}>Check again requirements</button>
            </div>
        }

        {
          step === 3 && !missingRequirements &&
            <div>
              <p>Requirements are satisfied. Please proceed with the services installation.</p>
              <button onClick={async () => await this.installServices()}>Install services</button>
            </div>
        }

        {
          step === 4 && installation &&
            <div>
              <p>Services installation in progress, please wait a while...</p>
              <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>
            </div>
        }

        {
          step === 5 && servicesInstalled &&
            <div>
              <h2>Yeah! All services have been installed.</h2>
              <p>Please, continue to the login page</p>
              <button onClick={async () => await this.props.postSetup()}>Continue</button>
            </div>
        }

        {
          step === 5 && !servicesInstalled &&
            <div>
              <h2>Sorry, there were some issues involving the services installation.</h2>
              <p>Please refer to the FAQ or send a request to the support team.</p>
              <p>Please, continue to the login page</p>
              <button onClick={async () => await this.props.postSetup()}>Continue</button>
            </div>
        }
      </div>
    )
  }
}

export default Setup
