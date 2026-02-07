"use client";


import Link from 'next/link'
import React from 'react'
import { useOverlayContext } from '@/context/overlay_context'

function Navbar() {
   const {toggleOverlaySettings} = useOverlayContext()
  return (
  <header className='px-8 pt-3 pb-16'>
      <nav className="flex justify-between items-center">
          <div className='flex items-center gap-5'>
            <Link href="/Decks">
                <span>Decks</span>
            </Link>
            <button onClick={()=>toggleOverlaySettings("create")}>
              <span>
                Create_Test
              </span>
            </button>
          </div>
      </nav>
  </header>
  )
}

export default Navbar