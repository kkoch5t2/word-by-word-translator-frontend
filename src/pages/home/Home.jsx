import React from 'react'
import './Home.css'
import Topbar from '../../commponens/Topbar/Topbar'
import Translation from '../../commponens/Translation/Translation'

export default function Home() {
  return (
    <>
        <Topbar />
        <div className='homeContainer pb-5'>
          <div className='rightWrapper'>
            <Translation />
          </div>
        </div>
    </>
  )
}
