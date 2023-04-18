import React, { getGlobal } from 'reactn'
import './css/Sidebar.css'
import { ReactComponent as LogoInlineWhite } from '../Assets/logoinlinewhite.svg'
import { ReactComponent as User } from '../Assets/utils/user.svg'
import { ReactComponent as Pc } from '../Assets/main/pc.svg'
import { ReactComponent as License } from '../Assets/main/license.svg'
import { ReactComponent as Storage } from '../Assets/main/storage.svg'
import { ReactComponent as Network } from '../Assets/main/network.svg'
import { ReactComponent as Logout } from '../Assets/utils/logout.svg'

const WHITE = '#ffffff'
const GRAY = 'rgba(200, 200, 200, 0.5)'

const Sidebar = ({ selected }) => {
  const { username } = getGlobal()

  return (
    <div className='sidebar'>
      <div className='sidelogo'>
        <LogoInlineWhite />
      </div>

      <div className='sideuserbox'>
        <User />
        <span>{username}</span>
      </div>

      <div className='sideitembox'>
        <Pc />
        <span style={{ color: selected === 'vms' ? WHITE : GRAY }}>Virtual Machines</span>
      </div>
      <div className='sideitembox'>
        <Storage />
        <span style={{ color: selected === 'storage' ? WHITE : GRAY }}>Storage</span>
      </div>
      <div className='sideitembox'>
        <Network />
        <span style={{ color: selected === 'network' ? WHITE : GRAY }}>Network</span>
      </div>
      <div className='sideitembox'>
        <License />
        <span style={{ color: selected === 'licences' ? WHITE : GRAY }}>Licenses</span>
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