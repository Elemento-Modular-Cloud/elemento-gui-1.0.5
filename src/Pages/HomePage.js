import React, { Component } from 'reactn'
import { Api, clearState, persistState } from '../Services'
import { Config } from '../Global'

class HomePage extends Component {
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
    const { page, body } = styles

    return (
      <div style={page}>
        <div style={body}>
          <h1>Home page</h1>
          <button onClick={() => this.logout()}>Logout</button>
          <h3>Pages</h3>
          <ul>
            <li><a href='/licences'>Licences</a></li>
            <li><a href='/network'>Network</a></li>
            <li><a href='/storage'>Storage</a></li>
          </ul>
        </div>
      </div>
    )
  }
}

const styles = {
  page: {
  },
  body: {
  }
}

export default HomePage
