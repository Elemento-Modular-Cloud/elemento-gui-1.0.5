import React from 'reactn'
import { useNavigate } from 'react-router-dom'
import './css/Button.css'
import { ReactComponent as Arrow } from '../Assets/utils/arrow.svg'

const Button = ({ Icon, page, name, text }) => {
  const navigate = useNavigate()
  return (
    <div className='btncard'>
      <Icon className='btnicon' />
      <br />
      <span className='btnspan'>{name}</span>
      <br />
      <span className='btntext'>{text}</span>
      <Arrow className='btnarrow' onClick={() => navigate(page)} />
    </div>
  )
}

export default Button
