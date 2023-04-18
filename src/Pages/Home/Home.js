import React, { Component } from 'reactn'
import { Api, clearState, persistState } from '../../Services'
import { Config } from '../../Global'
import { Background, Button } from '../../Components'
import onde from '../../Assets/onde.svg'
import logobigwhite from '../../Assets/logobigwhite.svg'
import './Home.css'

class Home extends Component {
  async navigate () {
    await this.setGlobal({}, persistState)
    this.props.history.push('/calendar')
  }

  componentDidMount () {
    this.checkLoggedIn()
  }

  async checkLoggedIn () {
    try {
      const { username, password } = this.global
      Api.createClient(Config.API_URL_AUTHENT)
      const res = await Api.get('/login', { username, password })
      console.log(res.ok ? 'Logged In' : 'Logged out')
    } catch (error) {
      window.alert('Could not connect to remote services')
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
      window.alert('Could not logout from services')
    }
  }

  render () {
    return (
      <Background
        backgroundColor='rgba(30, 30, 30, 1)'
        backgroundImage={onde}
      >
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
              <Button page='/vm' name='Virtual Machines' text='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
              <Button page='/Storage' name='Storage' text='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
              <Button page='/network' name='Network' text='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
              <Button page='/licences' name='Licences' text='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
            </div>

            <div className='homefooter'>
              <div className='btnlogout' onClick={() => this.logout()}>
                <span>Logout</span>
              </div>

              <div className='btnhelp' onClick={() => this.logout()}>
                <span>Help</span>
              </div>
            </div>
          </div>

        </div>
      </Background>
    )
  }
}

export default Home
