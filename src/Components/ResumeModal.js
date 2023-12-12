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
        <Resume hideButtons />
      </Modal>
    </div>
  )
}

const customStyle = {
  content: {
    minWidth: 550,
    height: 500,
    padding: 0,
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
