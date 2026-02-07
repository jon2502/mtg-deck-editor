"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useOverlayContext } from '@/context/overlay_context'

const page = () => {
  const {toggleOverlaySettings} = useOverlayContext()
  const [decks, setDecks] = useState([])

  async function importDecks() {
        console.log('test')
        const response = await fetch (`http://localhost:3500/GetDecks`)
        const decks = await response.json()
        setDecks(decks)
    }
    useEffect(() =>{
      importDecks()
    },[])
    
  return (
    <section>
      {decks.map((deck: {name:string, format:string, color:string, _id:string}) =>(
        <div key={deck.name}>
          <h1>{deck.name}</h1>
          <p>{deck.format}</p>
          <p>{deck.color}</p>
          <button>
            <Link href={`/Decks/Edit/${deck._id}`}>
              <span>Edit</span>
            </Link>
          </button>
          <button onClick={()=>toggleOverlaySettings("delete", deck._id)}>
            <span>
              Delete
            </span>
          </button>
        </div>
      ))}


    </section>
  )
}

export default page