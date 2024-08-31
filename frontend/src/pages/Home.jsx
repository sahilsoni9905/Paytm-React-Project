import React from 'react'
import TopBar from '../component/TopBar.jsx'
import Hero from '../component/Hero.jsx'

function Home() {
  return (
    <div className='flex flex-col'>
      <TopBar/>
      <Hero/>
    </div>
  )
}

export default Home