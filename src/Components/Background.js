import React from 'react'

const Background = ({ children, backgroundColor, backgroundImage }) => {
  return (
    <div
      style={{
        ...styles.background,
        backgroundColor,
        backgroundImage: `url(${backgroundImage})`,
        overflow: 'hidden'
      }}
    >
      <div style={styles.shadow}>
        {children}
      </div>
    </div>
  )
}

const styles = {
  shadow: {
    height: '100vh',
    width: '100%'
  },
  background: {
    height: '100vh',
    width: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'auto',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }
}

export default Background
