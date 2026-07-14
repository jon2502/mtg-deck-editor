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

interface card {
    count: number;
    set:string; 
    collector_number:string;
    art:string;
    oracleid:string;
}

interface category {
    categoryName: string;
    cards: Array<card>
    permissions: {
    canRename: boolean,
    canDelete: boolean
  },
    index: number
}

const Deck = ({id}:DeckProps) => {
    const {toggleOverlaySettings} = useOverlayContext()
    const {deckinfo, importDeck} = useDeckContext()
    const [editable, setEditable] = useState<category[]>([])
    const [nonEditable, setNonEditable] = useState<category[]>([])
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

    useEffect(() =>{
        var canedit = deckinfo.deck
        .map((category, index)=> ({...category, index}))
        .filter(category => category.permissions.canDelete === true && category.permissions.canRename === true)
        setEditable(canedit)
        var cannotedit = deckinfo.deck
        .map((category, index)=> ({...category, index}))
        .filter(category => category.permissions.canDelete === false && category.permissions.canRename === false)
        setNonEditable(cannotedit)
    },[deckinfo])

    return (
        <section>
            <div>
                <h1>{deckinfo?.name}</h1>
                <button onClick={()=>toggleOverlaySettings("Add-Category")}>Add Category</button>
            </div>
            <div>
                {nonEditable.map((catagory: category)=>(
                    <div key={catagory.categoryName} className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5'>
                    <p>{catagory.categoryName}</p>
                    {catagory.cards.map((card)=>(
                        <div key={card.collector_number}>
                            <div className="relative w-full aspect-[5/7] bg-muted overflow-hidden">
                                <Image
                                    src={card.art}
                                    alt={card.set+"/"+card.collector_number}
                                    fill
                                    unoptimized
                                />
                            </div>
                            <div>
                                <button onClick={()=>toggleOverlaySettings("Update-Card", {oracleid:card.oracleid, set:card.set, collector_number:card.collector_number, index:catagory.index})}>
                                    Update
                                </button>
                                <button onClick={()=>toggleOverlaySettings("Remove-Card", {set:card.set, collector_number:card.collector_number, index:catagory.index})}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    {catagory.categoryName === "Main Deck" &&
                        editable.map((catagory: category)=>(
                            <div key={catagory.categoryName} className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5'>
                            <p>{catagory.categoryName}</p>
                            {catagory.cards.map((card)=>(
                                <div key={card.collector_number}>
                                    <div className="relative w-full aspect-[5/7] bg-muted overflow-hidden">
                                        <Image
                                            src={card.art}
                                            alt={card.set+"/"+card.collector_number}
                                            fill
                                            unoptimized
                                        />
                                    </div>
                                    <div>
                                        <button onClick={()=>toggleOverlaySettings("Update-Card", {oracleid:card.oracleid, set:card.set, collector_number:card.collector_number, index:catagory.index})}>
                                            Update
                                        </button>
                                        <button onClick={()=>toggleOverlaySettings("Remove-Card", {set:card.set, collector_number:card.collector_number, index:catagory.index})}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        ))
                    }
                </div>
                ))}
            </div>
            <button onClick={save}>save</button>
        </section>
    )
}

export default Deck