import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
  <header className='px-8 pt-3 pb-16'>
      <nav className="flex justify-between items-center">
          <div className='flex items-center gap-5'>
            <Link href="/Decks">
                <span>Decks</span>
            </Link>
            <Link href="/Decks/Create">
                <span>Create Deck</span>
            </Link>
          </div>
      </nav>
  </header>
  )
}

export default Navbar