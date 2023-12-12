import React from 'react'
import { ReactComponent as Loading } from '../Assets/loading.svg'
import './css/Loader.css'

const Loader = ({ style }) => {
  return (
    <Loading className='loading' style={style} />
  )
}

export default Loader
