import React from 'react'
import { useNavigate } from 'react-router-dom'
import './css/Back.css'
import { ReactComponent as Refresh } from '../Assets/utils/refresh.svg'

const Back = ({ page, refresh }) => {
  const navigate = useNavigate()

  return (
    <div className='toolsbox'>
      {
        refresh &&
          <div className='refreshbtn' onClick={async () => await refresh()}>
            <Refresh />
          </div>
      }
      <div className='backbtn' onClick={() => navigate(page)}>
        <span>Back</span>
      </div>
    </div>
  )
}

export default Back
