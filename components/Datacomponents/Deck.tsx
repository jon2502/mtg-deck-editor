"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from "@/context/deck_context"

interface DeckProps {
  id: string;
}

/*interface Decktypes {
    name: string;
    deck: Array<{
        categoryName: string;
        cards: Array<{
            count: number;
            set:string; 
            collector_number:string
        }>
    }>;
}*/

const Deck = ({id}:DeckProps) => {
    //const [deck, setDeck] = useState<Decktypes[]>([])
    const {toggleOverlaySettings} = useOverlayContext()
    const {deckinfo, importDeck} = useDeckContext()

    async function save() {
        
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
            <button onClick={save}>save</button>
        </section>
    )
}

/*
            {deck[0]?.deck.map((catagories)=>(
                <div key={catagories.categoryName}>
                    <p>{catagories.categoryName}</p>
                    {catagories.cards.map((card)=>(
                        <div key={card.collector_number}>

                        </div>
                    ))}
                </div>
                
            ))} 
*/
export default Deck