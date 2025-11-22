"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const page = () => {
  const [decks, setDecks] = useState([])

  async function importDeck() {
        console.log('test')
        const response = await fetch (`http://localhost:3500/GetDecks`)
        const decks = await response.json()
        setDecks(decks)
    }
    useEffect(() =>{
      importDeck()
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
          <button>
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