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
         fetch("http://localhost:3500/Save",{
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
                {deckinfo.deck.map((catagories, index:number)=>(
                <div key={catagories.categoryName} className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5'>
                    <p>{catagories.categoryName}</p>
                    {catagories.cards.map((card)=>(
                        <div key={card.collector_number} className="relative w-full aspect-[5/7] bg-muted overflow-hidden">
                            <Image
                                src={card.art}
                                alt={card.set+"/"+card.collector_number}
                                fill
                                sizes='50vw'
                            />
                            <button onClick={()=>toggleOverlaySettings("Update-Card", {oracleid:card.oracleid, set:card.set, collector_number:card.collector_number, index:index})}>
                                Update
                            </button>
                            <button onClick={()=>toggleOverlaySettings("Remove-Card", {set:card.set, collector_number:card.collector_number, index:index})}>
                                Remove
                            </button>
                        </div>
                    ))}
                    {catagories.categoryName == "Main Deck" ?(
                        <>
                        {catagories.categories!.map((catagories, index:number)=>(
                            <div key={catagories.categoryName} className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5'>
                            <p>{catagories.categoryName}</p>
                            {catagories.cards.map((card)=>(
                                <div key={card.collector_number} className="relative w-full aspect-[5/7] bg-muted overflow-hidden">
                                    <Image
                                        src={card.art}
                                        alt={card.set+"/"+card.collector_number}
                                        fill
                                        sizes='50vw'
                                    />
                                    <button onClick={()=>toggleOverlaySettings("Update-Card", {oracleid:card.oracleid, set:card.set, collector_number:card.collector_number, index:index})}>
                                        Update
                                    </button>
                                    <button onClick={()=>toggleOverlaySettings("Remove-Card", {set:card.set, collector_number:card.collector_number, index:index})}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                            </div>
                        ))}
                        </>
                    ):null}
                </div>
            ))} 
            </div>
            <button onClick={save}>save</button>
        </section>
    )
}


export default Deck