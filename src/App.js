import React, { Component } from 'reactn'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { restoreState } from './Services'
import {
  Home, Licences, Login, Network,
  Storage, BasicSetup, AdvancedSetup, // Setup,
  VirtualMachineList, VirtualMachineNew
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
      <HashRouter>
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/licences' element={<Licences />} />
          <Route path='/network' element={<Network />} />
          <Route path='/storage' element={<Storage />} />
          <Route path='/vmlist' element={<VirtualMachineList />} />
          <Route path='/newvm' element={<VirtualMachineNew />} />
          <Route path='/newvm/basic' element={<BasicSetup />} />
          <Route path='/newvm/advanced' element={<AdvancedSetup />} />
        </Routes>
      </HashRouter>
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
  // render () {
  //   const { setup, loggedIn } = this.state
  //   return (
  //     !setup
  //       ? <Setup postSetup={() => this.setState({ setup: true })} />
  //       : (
  //           loggedIn
  //             ? this.renderApp()
  //             : <Login postLogin={() => this.setState({ loggedIn: true })} />
  //         )
  //   )
  // }
}
