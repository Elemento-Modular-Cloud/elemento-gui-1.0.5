import React from 'reactn'
import { useNavigate } from 'react-router-dom'
import './css/ButtonBlack.css'
import { ReactComponent as Arrow } from '../Assets/utils/arrow.svg'
import { useEffect, useRef } from 'react'

const Button = ({ Icon, page, name, text }) => {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  useEffect(() => {
    // Initialising the canvas
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    canvas.width = 220
    canvas.height = 220

    // Setting up the letters
    const letters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンーァィゥェォッャュョヮヴ'.split('')

    // Setting up the columns
    const fontSize = 10
    const columns = canvas.width / fontSize

    // Setting up the drops
    const drops = []
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    // Setting up the draw function
    function draw () {
      ctx.fillStyle = 'rgba(0, 0, 0, .1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)]
        ctx.fillStyle = '#0f0'
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        drops[i]++
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0
        }
      }
    }

    // Loop the animation
    setInterval(draw, 100)
  }, [])

  return (
    <div className='btncardblack' onClick={() => navigate(page)}>
      <canvas id='canvas' ref={canvasRef} className='matrix' />
      <div className='btncardblackcontent'>
        <Icon id='svgicon' className='btniconblack' />
        <span className='btnspanblack'>{name}</span>
        <span className='btntextblack'>{text}</span>
        <div className='btnarrowdiv'>
          <Arrow className='btnarrowblack' />
          <span>Click to setup</span>
        </div>
      </div>
    </div>
  )
}

export default Button
