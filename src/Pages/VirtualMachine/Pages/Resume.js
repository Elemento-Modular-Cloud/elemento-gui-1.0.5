import React, { Component } from 'reactn'

class Resume extends Component {
  constructor (props) {
    super(props)
    this.state = {
      advancedSetup: null
    }
  }

  componentDidMount () {
    const { advancedSetup } = this.global

    console.log(advancedSetup)

    this.setState({ advancedSetup })
  }

  render () {
    const { advancedSetup: x } = this.state

    return (
      <div>
        <h2>Resume</h2>

        {
          x &&
            <div>
              <p>Name: {x.name}</p>
              <br />
              <p>Cores: {x.cores}</p>
              <p>Overprovision: {x.overprovision}</p>
              <p>Archs List: {JSON.stringify(x.archsList)}</p>
              <p>Flags: {JSON.stringify(x.flags)}</p>
              <br />
              <p>Memory: {x.size}</p>
              <p>Ecc: {x.ecc ? 'Yes' : 'No'}</p>
              <br />
              <p>Volumes: {JSON.stringify(x.volumeIds)}</p>
              <br />
            </div>
        }

        <button onClick={async () => await this.props.register()}>Register</button>
      </div>
    )
  }
}

export default Resume
