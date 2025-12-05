"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Overlay from "@/components/Overlay";

const page = () => {
  const [decks, setDecks] = useState([])
  const [overlay, setOverlay] = useState(false)

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
      {overlay ?(
        <Overlay/>
      ):(null)}
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
          <button onClick={()=>setOverlay(true)}>
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