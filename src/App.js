import React, { Component } from 'reactn'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { restoreState } from './Services'
import { HomePage, Licences, Login, Network, Storage } from './Pages'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  async componentDidMount () {
    await restoreState()
    this.setState({ loggedIn: this.global.loggedIn })
  }

  renderApp () {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<HomePage />} />
          <Route path='licences' element={<Licences />} />
          <Route path='network' element={<Network />} />
          <Route path='storage' element={<Storage />} />
        </Routes>
      </BrowserRouter>
    )
  }

  render () {
    const { loggedIn } = this.state
    return (
      loggedIn
        ? this.renderApp()
        : <Login postLogin={() => this.setState({ loggedIn: true })} />
    )
  }
}
