import React from 'reactn'
import { useNavigate } from 'react-router-dom'

const Button = ({ children, className, page }) => {
  const navigate = useNavigate()
  return (
    <div className={className} onClick={() => navigate(page)}>
      {children}
    </div>
  )
}

export default Button
