import React, { Component } from 'reactn'
import { Api, persistState } from '../../Services'
import { Config } from '../../Global'
import { Background } from '../../Components'
import onde from '../../Assets/onde.svg'
import logoinline from '../../Assets/logoinline.svg'
import './Login.css'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      register: false,
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
    const res = await Api.put('/account/register', {
      acc_data: {
        user_name: name,
        user_surname: surname,
        email,
        password: passwordr
      }
    })

    if (res.ok) {
      window.alert('You\'ve been registered successfully!')
      await this.setGlobal({ loggedIn: true }, persistState)
      this.props.postLogin()
    } else {
      window.alert('Error during register process')
    }
  }

  render () {
    const { register, username, password, name, surname, email, passwordr, disableLogin } = this.state

    return (
      <Background
        backgroundColor='rgba(30, 30, 30, 1)'
        backgroundImage={onde}
      >
        <div className='loginpage'>
          {
            !register &&
              <div className='logincard'>
                <div
                  style={{
                    backgroundImage: `url(${logoinline})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    width: 250,
                    height: 50,
                    margin: 20
                  }}
                />
                <div className='loginbox'>
                  <span>Username or email*</span>
                  <input type='text' value={username} onChange={e => this.setState({ username: e.target.value })} />
                  <span>Password*</span>
                  <input type='password' value={password} onChange={e => this.setState({ password: e.target.value })} />
                </div>
                <div
                  className='loginbutton'
                  onClick={async () => await this.login()} disabled={disableLogin}
                >
                  <span>LOGIN</span>
                </div>
                <p className='loginregister' onClick={() => this.setState({ register: !register })}>CREATE AN ACCOUNT</p>
              </div>
          }

          {
            register &&
              <div className='registercard'>
                <div
                  style={{
                    backgroundImage: `url(${logoinline})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    width: 250,
                    height: 50,
                    margin: 20
                  }}
                />
                <div className='registerbox'>
                  <span>Name*</span>
                  <input type='text' value={name} onChange={e => this.setState({ name: e.target.value })} />
                  <span>Surname*</span>
                  <input type='text' value={surname} onChange={e => this.setState({ surname: e.target.value })} />
                  <span>Email*</span>
                  <input type='text' value={email} onChange={e => this.setState({ email: e.target.value })} />
                  <span>Password*</span>
                  <input type='password' value={passwordr} onChange={e => this.setState({ passwordr: e.target.value })} />
                </div>

                <div
                  className='registerbutton'
                  onClick={async () => await this.register()}
                >
                  <span>REGISTER</span>
                </div>
                <p className='loginregister' onClick={() => this.setState({ register: !register })}>LOGIN</p>
              </div>
            }
        </div>
      </Background>
    )
  }
}

export default Login
