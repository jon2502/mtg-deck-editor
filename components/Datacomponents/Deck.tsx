"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from "@/context/deck_context"
import {searchCard} from "@/services/scryfall/GETCard"

interface DeckProps {
  id: string;
}

const Deck = ({id}:DeckProps) => {
    const {toggleOverlaySettings} = useOverlayContext()
    const {deckinfo, importDeck} = useDeckContext()
    const router = useRouter()

    async function save() {
        console.log(deckinfo)
         fetch("http://localhost:3500/SaveDeck",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deckinfo)
    })
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
                            <Image
                                src={card.art}
                                alt="test"
                                width="100"
                                height="100"
                            />
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