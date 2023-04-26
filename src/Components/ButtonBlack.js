import React from 'reactn'
import { useNavigate } from 'react-router-dom'
import './css/ButtonBlack.css'
import { ReactComponent as Arrow } from '../Assets/utils/arrow.svg'

const Button = ({ Icon, page, name, text }) => {
  const navigate = useNavigate()
  return (
    <div className='btncardblack' onClick={() => navigate(page)}>
      <Icon id='svgicon' className='btniconblack' />
      <br />
      <span className='btnspanblack'>{name}</span>
      <br />
      <span className='btntextblack'>{text}</span>
      <div className='btnarrowdiv'>
        <Arrow className='btnarrowblack' />
        <span>Click to setup</span>
      </div>
    </div>
  )
}

export default Button
