import React from 'reactn'
import { useNavigate } from 'react-router-dom'
import './css/ButtonOrange.css'
import { ReactComponent as Arrow } from '../Assets/utils/arrow.svg'
import { ReactComponent as Settings } from '../Assets/utils/settings.svg'

const Button = ({ Icon, page, name, text }) => {
  const navigate = useNavigate()
  return (
    <div className='btncardorange' onClick={() => navigate(page)}>
      <Settings id='svgsett' className='btniconorange' />
      <Icon id='svgicon' className='btniconorange' />
      <br />
      <span className='btnspanorange'>{name}</span>
      <br />
      <span className='btntextorange'>{text}</span>
      <div className='btnarrowdiv'>
        <Arrow className='btnarroworange' />
        <span>Click to setup</span>
      </div>
    </div>
  )
}

export default Button
