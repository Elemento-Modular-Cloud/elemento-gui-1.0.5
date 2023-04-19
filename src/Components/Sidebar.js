import React, { getGlobal } from 'reactn'
import { useNavigate } from 'react-router-dom'
import './css/Sidebar.css'
import { ReactComponent as LogoInlineWhite } from '../Assets/logoinlinewhite.svg'
import { ReactComponent as User } from '../Assets/utils/user.svg'
import { ReactComponent as Pc } from '../Assets/main/pc.svg'
import { ReactComponent as License } from '../Assets/main/license.svg'
import { ReactComponent as Storage } from '../Assets/main/storage.svg'
import { ReactComponent as Network } from '../Assets/main/network.svg'
import { ReactComponent as Logout } from '../Assets/utils/logout.svg'

const Sidebar = ({ selected }) => {
  const { username } = getGlobal()
  const navigate = useNavigate()

  return (
    <div className='sidebar'>
      <div className='sidelogo'>
        <LogoInlineWhite />
      </div>

      <div className='sideuserbox'>
        <User />
        <span>{username}</span>
      </div>

      <div className={selected === 'vms' ? 'sideitemboxselected' : 'sideitembox'} onClick={() => navigate('/vm')}>
        <Pc />
        <span>Virtual Machines</span>
      </div>
      <div className={selected === 'storage' ? 'sideitemboxselected' : 'sideitembox'} onClick={() => navigate('/storage')}>
        <Storage />
        <span>Storage</span>
      </div>
      <div className={selected === 'network' ? 'sideitemboxselected' : 'sideitembox'} onClick={() => navigate('/network')}>
        <Network />
        <span>Network</span>
      </div>
      <div className={selected === 'licences' ? 'sideitemboxselected' : 'sideitembox'} onClick={() => navigate('/licences')}>
        <License />
        <span>Licenses</span>
      </div>

      <div className='sidefooter'>
        <hr />
        <div className='sidefooterlogout'>
          <Logout />
          <span>Logout</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
