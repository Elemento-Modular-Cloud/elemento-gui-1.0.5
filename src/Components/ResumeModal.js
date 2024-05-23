import React, { useState } from 'react'
import Modal from 'react-modal'
import './css/Resume.css'
import { ReactComponent as Pc } from '../Assets/main/pc.svg'
import { Resume } from '../Pages/VirtualMachine/Pages'

const ResumeModal = () => {
  const [modal, setModal] = useState(false)

  return (
    <div className='resumebtn' onClick={() => setModal(!modal)}>
      <Pc />
      Summary

      <Modal
        isOpen={modal}
        style={customStyle}
        className='netmodal'
        ariaHideApp={false}
        onRequestClose={() => setModal(!modal)}
      >
        <span style={{ fontSize: 22, fontWeight: 'bold' }}>Create new Virtual Machine - Summary</span>
        <Resume
          hideButtons
          hideProviders
          hideBottomBar
        />
      </Modal>
    </div>
  )
}

const customStyle = {
  content: {
    minWidth: 550,
    height: 400,
    padding: 20,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    position: 'absolute',
    zIndex: 99999,
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white'
  },
  outline: 'none'
}

export default ResumeModal
