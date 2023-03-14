import React from 'react'
import { useNavigate } from 'react-router-dom'

const Button = ({ name, page }) => {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(page)}>{name}</button>
  )
}

export default Button
