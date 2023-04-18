import React from 'reactn'
import { useNavigate } from 'react-router-dom'
import './css/Button.css'
import arrow from '../Assets/utils/arrow.svg'

const Button = ({ icon, page, name, text }) => {
  const navigate = useNavigate()
  return (
    <div className='btncard'>
      <div
        className='btnicon'
        style={{
          backgroundImage: `url(${icon})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain'
        }}
      />
      <span className='btnspan'>{name}</span>
      <br />
      <span className='btntext'>{text}</span>
      <div
        className='btnarrow'
        onClick={() => navigate(page)}
        style={{
          backgroundImage: `url(${arrow})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain'
        }}
      />
    </div>
  )
}

export default Button
