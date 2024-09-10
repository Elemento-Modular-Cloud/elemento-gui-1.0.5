import React, { Component } from 'reactn'
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  isEnabled as isDarkReaderEnabled
} from 'darkreader'
import { Api, clearState, persistState } from '../../Services'
import { Config } from '../../Global'
import { Background, Button, Daemons, Navigate, ToggleSwitch } from '../../Components'
import onde from '../../Assets/onde.svg'
import logobigwhite from '../../Assets/logobigwhite.svg'
import { ReactComponent as Pc } from '../../Assets/main/pc.svg'
import { ReactComponent as License } from '../../Assets/main/license.svg'
import { ReactComponent as Storage } from '../../Assets/main/storage.svg'
// import { ReactComponent as Network } from '../../Assets/main/network.svg'
import { ReactComponent as Logout } from '../../Assets/utils/logout.svg'
import { ReactComponent as Help } from '../../Assets/utils/help.svg'
import { ReactComponent as Settings } from '../../Assets/main/settings.svg'
import './Home.css'
import swal from 'sweetalert'

class Home extends Component {
  async componentDidMount () {
    try {
      const { username, password } = this.global
      Api.createClient(Config.API_URL_AUTHENT)
      const res = await Api.get('/login', { username, password })
      if (!res.ok) {
        swal('Error', 'Could not login to the services. Please, try again later.', 'error', {
          buttons: false,
          timer: 3000
        }).then(async () => {
          await this.setGlobal({ loggedIn: false, setup: false }, persistState)
          await clearState()
          window.location.reload()
        })
      }

      try {
        window.require('electron').ipcRenderer.send('get-settings')

        window.require('electron').ipcRenderer.on('settings-data', async (event, arg) => {
          if (arg) {
            const { sshKey } = arg

            await this.setGlobal({ sshKey: sshKey || null }, persistState)
          }
        })
      } catch (error) {
        console.log(error.message)
      }
    } catch (error) {
      swal('Error', 'Could not connect to remote services', 'error', {
        buttons: false,
        timer: 3000
      }).then(async () => {
        await this.setGlobal({ loggedIn: false, setup: false }, persistState)
        await clearState()
        window.location.reload()
      })
    }
  }

  async logout () {
    Api.createClient(Config.API_URL_AUTHENT)
    const res = await Api.post('/logout', {})

    if (res.ok) {
      await this.setGlobal({ loggedIn: false }, persistState)
      await clearState()
      window.location.reload()
    } else {
      swal('Error', 'Could not logout from services', 'error', {
        buttons: false,
        timer: 3000
      })
    }
  }

  async openExternalLink () {
    window.require('electron').ipcRenderer.send('open-external-link', 'https://github.com/elemento-Modular-Cloud/helpcenter')
  }

  toggleDarkMode () {
    if (isDarkReaderEnabled()) {
      disableDarkMode()
    } else {
      enableDarkMode({
        brightness: 100,
        contrast: 100,
        sepia: 0,
        darkSchemeBackgroundColor: '#202020',
        darkSchemeTextColor: 'lightgray',
        lightSchemeBackgroundColor: '#dcdad7',
        lightSchemeTextColor: '#202020'
      })
    }
  }

  render () {
    return (
      <Background
        backgroundColor='rgba(30, 30, 30, 1)'
        backgroundImage={onde}
      >
        <Navigate page='/settings'>
          <div className='btnsettings'>
            <Settings />
            <span>Settings</span>
          </div>
        </Navigate>

        <div style={{ position: 'absolute', top: 20, right: 20, width: '100%', height: 40, display: 'flex', justifyContent: 'flex-end' }}>
          <ToggleSwitch toggle={() => this.toggleDarkMode()} />
        </div>

        <div className='homepage'>

          <div className='homeheader'>
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
          <div className='homebody'>
            <div className='homebuttons'>
              <Button Icon={Storage} page='/storage' name='Storage' text='Volumes creation to mount in your virtual machines' />
              <Button Icon={Pc} page='/vmlist' name='Virtual Machines' text='Virtual machines management and visualization' />
              {/* <Button Icon={Network} page='/network' name='Network' text='Network Management' /> */}
              <Button Icon={License} page='/licences' name='Licences' text='License management of Elemento Cloud' />
              {/* <Button Icon={Settings} page='/settings' name='Settings' text='App settings and management' /> */}
            </div>

            <div className='homefooter'>
              <div className='btnlogout' onClick={() => this.logout()}>
                <Logout />
                <span>Logout</span>
              </div>

              <div className='btnhelp' onClick={() => this.openExternalLink()}>
                <Help />
                <span>Help</span>
              </div>
            </div>
          </div>

          <Daemons />
        </div>
      </Background>
    )
  }
}

export default Home
