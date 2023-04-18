import React, { Component } from 'reactn'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { restoreState } from './Services'
import {
  Home, Licences, Login, Network,
  Storage, VirtualMachine, NewVirtualMachine,
  BasicSetup, AdvancedSetup, Setup
} from './Pages'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      setup: false,
      loggedIn: false
    }
  }

  async componentDidMount () {
    await restoreState()
    const { loggedIn, setup } = this.global
    this.setState({ loggedIn, setup })
  }

  renderApp () {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/licences' element={<Licences />} />
          <Route path='/network' element={<Network />} />
          <Route path='/storage' element={<Storage />} />
          <Route path='/vm' element={<VirtualMachine />} />
          <Route path='/newvm' element={<NewVirtualMachine />} />
          <Route path='/newvm/basic' element={<BasicSetup />} />
          <Route path='/newvm/advanced' element={<AdvancedSetup />} />
        </Routes>
      </BrowserRouter>
    )
  }

  render () {
    const { setup, loggedIn } = this.state
    return (
      !setup
        ? <Setup postSetup={() => this.setState({ setup: true })} />
        : (
            loggedIn
              ? this.renderApp()
              : <Login postLogin={() => this.setState({ loggedIn: true })} />
          )
    )
  }
}
