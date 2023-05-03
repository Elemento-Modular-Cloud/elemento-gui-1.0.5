import React, { Component } from 'reactn'
import io from 'socket.io-client'
import LinearProgress from '@mui/material/LinearProgress'
import onde from '../../Assets/onde.svg'
import logobigwhite from '../../Assets/logobigwhite.svg'
import { Api, persistState } from '../../Services'
import { Config } from '../../Global'
import './Setup.css'
import { Background } from '../../Components'
import swal from 'sweetalert'

let socket = null

class Setup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      chunk: 0,
      downloaded: false,
      installed: false,
      loading: false
    }
  }

  wait (milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  async checkServicesClean () {
    Api.createClient(Config.API_INTERNALSVC)
    const res = await Api.get('/services')

    if (res.ok && res.data && res.data.matcher && res.data.storage && res.data.network && res.data.authent) {
      return true
    } else {
      return false
    }
  }

  async checkServices () {
    this.setState({ loading: true })
    await this.wait(2000)

    Api.createClient(Config.API_INTERNALSVC)
    const res = await Api.get('/services')

    if (
      res.ok && res.data &&
      res.data.matcher && res.data.storage && res.data.network && res.data.authent
    ) {
      this.setState({ downloaded: true, installed: true })
    } else {
      swal('Info', 'Services are not reachable. Please, check that the daemons are running and try again later.', 'info', {
        buttons: false,
        timer: 4000
      })
    }
    this.setState({ loading: false })
  }

  async componentDidUpdate () {
    if (!socket) {
      try {
        socket = io(Config.API_INTERNALSVC)
      } catch (error) {}
    }
  }

  async componentDidMount () {
    try {
      if (socket) {
        socket.on('connect', () => {})
      }
      await this.checkServices()
    } catch (error) {}
  }

  async downloadDaemons () {
    this.setState({ loading: true })

    socket.on('chunk', async (data) => {
      const chunk = data.chunk
      this.setState({ chunk })

      if (chunk === 100) {
        await this.wait(2000)
        this.setState({ downloaded: true, loading: false })
        const refresh = setInterval(async () => {
          const running = await this.checkServicesClean()
          if (running) {
            this.setState({ installed: true })
          }
        }, 2000)
        this.setState({ refresh })
      }
    })

    Api.createClient(Config.API_INTERNALSVC)
    await Api.get('/download')
  }

  async continue () {
    const { refresh } = this.state
    clearInterval(refresh)

    this.setState({ loading: true })
    await this.setGlobal({ setup: true }, persistState)
    await this.props.postSetup()
  }

  render () {
    const { chunk, downloaded, installed, loading } = this.state

    return (
      <Background
        backgroundColor='rgba(30, 30, 30, 1)'
        backgroundImage={onde}
      >
        <div className='setpage'>
          <div className='setheader'>
            <div
              className='logobigwhite'
              style={{
                backgroundImage: `url(${logobigwhite})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain'
              }}
            />
          </div>
          <div className='setbody'>
            <h1>Setup page</h1>
            {
              !downloaded &&
                <>
                  <span>Welcome to the Elemento Setup board!</span><br /><br />
                  <span>Before to use the Elemento app we must to setup some services useful to connect you to the Elemento Cloud services.</span><br />
                  <span>Please, click on Download button and next open the installer file. Then come here again and proceed to the next step!</span><br /><br />
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {!loading && <button className='downloadbutton' onClick={async () => await this.downloadDaemons()}>Download services</button>}
                    {!loading && <button className='downloadbutton' style={{ marginLeft: 20 }} onClick={async () => await this.checkServices()}>Check services</button>}
                  </div>
                  {loading && chunk === 0 && <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>}
                </>
            }
            {
              chunk > 0 && !downloaded &&
                <div className='setdownload'>
                  <LinearProgress variant='determinate' value={chunk} className='setbar' />
                  {chunk}%
                </div>
            }
            {
              downloaded && !installed &&
                <>
                  <span>Please, execute the daemons software so we could connect and let you log into the Elemento Cloud App.</span><br /><br />
                  <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>
                </>
            }
            {
              installed &&
                <>
                  <span>Great, all the services are installed and ready!</span><span style={{ marginLeft: 20, fontSize: 50 }}>🎉</span><br /><br />
                  {!loading && <button className='downloadbutton' onClick={async () => await this.continue()}>Continue</button>}
                  {loading && <div className='lds-roller'><div /><div /><div /><div /><div /><div /><div /><div /></div>}
                </>
            }
          </div>
        </div>
      </Background>
    )
  }
}

export default Setup
