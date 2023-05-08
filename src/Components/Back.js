import React from 'react'
import { useNavigate } from 'react-router-dom'
import './css/Back.css'

const Back = ({ page }) => {
  const navigate = useNavigate()

  return (
    <div className='backbtn' onClick={() => navigate(page)}>
      <span>Back</span>
    </div>
  )
}

export default Back
