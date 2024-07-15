import React, { useState } from 'react'
import './css/ToggleSwitch.css'

const ToggleSwitch = ({ toggle }) => {
  const [isOn, setIsOn] = useState(false)

  return (
    <div
      className={`toggle-switch ${isOn ? 'on' : ''}`}
      onClick={() => {
        setIsOn(!isOn)
        toggle()
      }}
    >
      <div className='toggle-switch-handle' />
    </div>
  )
}

export default ToggleSwitch
