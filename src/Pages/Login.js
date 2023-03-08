import React, { Component } from 'reactn'
import { Api, persistState } from '../Services'
import { Config } from '../Global'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      name: '',
      surname: '',
      email: '',
      passwordr: '',

      disableLogin: false
    }
  }

  async login () {
    this.setState({ disableLogin: true })
    const { username, password } = this.state

    Api.createClient(Config.API_URL_AUTHENT)
    const res = await Api.post('/login', { username, password })

    if (res.ok && res.data.authenticated) {
      await this.setGlobal({ loggedIn: true, username, password }, persistState)
      this.props.postLogin()
    } else {
      window.alert('Error during login process')
    }
    this.setState({ disableLogin: false })
  }

  async register () {
    const { name, surname, email, passwordr } = this.state

    Api.createClient(Config.API_URL_AUTHENT)
    const res = await Api.post('/account/register', {
      acc_data: {
        user_name: name,
        user_surname: surname,
        email,
        password: passwordr
      }
    })

    if (res.ok && res.data.authenticated) {
      window.alert('Logged in successfully')
      await this.setGlobal({ loggedIn: true }, persistState)
      this.props.postLogin()
    } else {
      window.alert('Error during login process')
    }
  }

  render () {
    const { username, password, name, surname, email, passwordr, disableLogin } = this.state
    const { page, body, footer } = styles

    return (
      <div style={page}>
        <div style={body}>
          Username:
          <input type='text' value={username} onChange={e => this.setState({ username: e.target.value })} />
          <br />
          Password:
          <input type='password' value={password} onChange={e => this.setState({ password: e.target.value })} />
          <br />
          <br />
          <button onClick={() => this.login()} disabled={disableLogin}>Login</button>
          <br />
          <br />
          <br />
          <br />
          Name:
          <input type='text' value={name} onChange={e => this.setState({ name: e.target.value })} />
          <br />
          Surname:
          <input type='text' value={surname} onChange={e => this.setState({ surname: e.target.value })} />
          <br />
          E-Mail:
          <input type='text' value={email} onChange={e => this.setState({ email: e.target.value })} />
          <br />
          Password:
          <input type='password' value={passwordr} onChange={e => this.setState({ passwordr: e.target.value })} />
          <br />
          <br />
          <button onClick={() => this.register()}>Register</button>
        </div>
        <div style={footer}>
          <p align='center'>2023 Elemento Cloud | Via Virginio Allione, 2, 12100 Cuneo CN, Italy  | P. IVA 03959360045</p>
        </div>
      </div>
    )
  }
}

const styles = {
  page: {

  },
  body: {

  },
  footer: {

  }
}

export default Login
