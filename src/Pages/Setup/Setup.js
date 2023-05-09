import React, { Component } from 'reactn'
import LinearProgress from '@mui/material/LinearProgress'
import onde from '../../Assets/onde.svg'
import logobigwhite from '../../Assets/logobigwhite.svg'
import { Api, persistState } from '../../Services'
import './Setup.css'
import { Background } from '../../Components'

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

  async componentDidMount () {
    this.intervalServices()

    window.require('electron').ipcRenderer.on('download-progress', async (event, arg) => {
      const { chunk } = arg.data
      this.setState({ chunk })

      if (chunk === 100) {
        this.setState({ downloaded: true, loading: false })
      }
    })
  }

  async intervalServices () {
    while (true) {
      const running = await this.checkServices()
      if (running) {
        this.setState({ downloaded: true, loading: false, installed: true })
        break
      } else {
        await this.wait(2000)
      }
    }
  }

  wait (milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  async checkServices (goto) {
    try {
      if (goto) {
        this.gotoServices()
      }
      const status = await Api.servicesStatus()
      return status
    } catch (error) {
      return false
    }
  }

  async gotoServices () {
    this.setState({ loading: true, downloaded: true, installed: false })
  }

  async downloadDaemons () {
    this.setState({ loading: true })
    window.require('electron').ipcRenderer.send('download-daemons', 'void')
  }

  async continue () {
    const { refresh } = this.global
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
                    {!loading && <button className='downloadbutton' style={{ marginLeft: 20 }} onClick={async () => await this.checkServices(true)}>Check services</button>}
                  </div>
                  {loading && chunk === 0 && <div className='loaderbox'><span className='loader' /></div>}
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
                  <span>Please, execute the daemons software from your Downloads folder so we could connect and let you log into the Elemento Cloud App.</span><br /><br />
                  <div className='loaderbox'><span className='loader' /></div>
                </>
            }
            {
              installed &&
                <>
                  <span>Great, all the services are installed correctly!</span><br />
                  <span style={{ marginLeft: 20, fontSize: 40, marginTop: 40 }}>Ready. Set. Cloud. 🏁🚀☁️</span><br /><br />
                  {!loading && <button className='downloadbutton' onClick={async () => await this.continue()}>Continue</button>}
                  {loading && <div className='loaderbox'><span className='loader' /></div>}
                </>
            }
          </div>
        </div>
      </Background>
    )
  }
}

export default Setup
