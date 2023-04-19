import React, { Component } from 'react'
import { Button, Sidebar } from '../../Components'
import './css/VirtualMachine.css'
import { ReactComponent as AddCircle } from '../../Assets/utils/addcircle.svg'
import { ReactComponent as List } from '../../Assets/utils/list.svg'

class VirtualMachine extends Component {
  render () {
    return (
      <div className='vmpage'>
        <Sidebar selected='vms' />
        <div className='vmbody'>
          <hr />

          <div className='vmheader'>
            <span>Virtual Machines</span>
            <a href='/'>Back</a>
          </div>

          <div className='vmbuttons'>
            <Button Icon={AddCircle} page='/newvm' name='Create new' text='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
            <div style={{ marginLeft: 80 }} />
            <Button Icon={List} page='/vmlist' name='Display' text='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
          </div>
        </div>
      </div>
    )
  }
}

export default VirtualMachine
