"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from "@/context/deck_context"

interface DeckProps {
  id: string;
}

const Deck = ({id}:DeckProps) => {
    //const [deck, setDeck] = useState<Decktypes[]>([])
    const {toggleOverlaySettings} = useOverlayContext()
    const {deckinfo, importDeck} = useDeckContext()
    const router = useRouter()
    
    

    async function save() {
         fetch("http://localhost:3500/SaveDeck",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deckinfo)
    })
    /*.then(res => res.json())
    .then(data => {
      router.push(`/Decks/Edit/${data._id}`)
    })*/
    }

    useEffect(() =>{
        importDeck(id)
    },[])
        
    return (
        <section>
            <div>
                <h1>{deckinfo?.name}</h1>
                <button onClick={()=>toggleOverlaySettings("Add-Category")}>Add Category</button>
            </div>
            <div>
                {deckinfo.deck.map((catagories)=>(
                <div key={catagories.categoryName}>
                    <p>{catagories.categoryName}</p>
                    {catagories.cards.map((card)=>(
                        <div key={card.collector_number}>

                        </div>
                    ))}
                </div>
            ))} 
            </div>
            <button onClick={save}>save</button>
        </section>
    )
}
export default Deck