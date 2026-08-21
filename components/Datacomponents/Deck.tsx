"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from "@/context/deck_context"
import {searchCard} from "@/services/scryfall/GETCard"
import CardImage from "@/components/cardImage"

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

    function createbuttons(oracleid:string, set:string, collector_number:string, index:number){
        return <div>
                    <button onClick={()=>toggleOverlaySettings("Update-Card", {oracleid:oracleid, set:set, collector_number:collector_number, index:index})}>
                        Update
                    </button>
                    <button onClick={()=>toggleOverlaySettings("Remove-Card", {set:set, collector_number:collector_number, index:index})}>
                        Remove
                    </button>
                </div>
    }

    useEffect(() =>{
        importDeck(id)        
    },[])

    useEffect(() =>{
        var canedit: category[] = []
        var cannotedit: category[]  = []
        deckinfo.deck.map((category, index)=> {
            if(category.permissions.canDelete === true && category.permissions.canRename === true){
                canedit.push({...category, index})
            } else if(category.permissions.canDelete === false && category.permissions.canRename === false){
                cannotedit.push({...category, index})
            }
        })
        setEditable(canedit)
        setNonEditable(cannotedit)
    },[deckinfo])

    console.log(deckinfo)

    return (
    <>
    <div>
        <h1>{deckinfo?.name}</h1>
        <button onClick={()=>toggleOverlaySettings("Add-Category")}>Add Category</button>
    </div>
    <section className='h-[75vh] overflow-auto overflow-x-hidden pr-3'>
        <div>
            {nonEditable.map((catagory: category)=>(
                <div key={catagory.categoryName} className='flex flex-col'>
                <p>{catagory.categoryName}</p>
                <div className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5 mb-2.5'>
                {catagory.cards.map((card)=>(
                    <div key={card.set+"/"+card.collector_number} >
                        <CardImage art={card.art} alttext={card.set+"/"+card.collector_number}/>
                        {createbuttons(card.oracleid, card.set, card.collector_number, catagory.index)}
                    </div>
                ))}
                </div>
                {catagory.categoryName === "Main Deck" &&
                    editable.map((catagory: category)=>(
                        <div key={catagory.categoryName} className='flex flex-col ml-3.5'>
                        <div className='flex flex-row'>
                            <p>{catagory.categoryName}</p>
                            <div>
                                <button>&#8593;</button>
                                <button>&#8595;</button>
                                <button>delete</button>
                            </div>
                        </div>
                        <div className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5 mb-2.5'>
                        {catagory.cards.map((card)=>(
                            <div key={card.set+"/"+card.collector_number}>
                                <CardImage art={card.art} alttext={card.set+"/"+card.collector_number}/>
                                {createbuttons(card.oracleid, card.set, card.collector_number, catagory.index)}
                            </div>
                        ))}
                        </div>
                    </div>
                    ))
                }
            </div>
            ))}
        </div>
    </section>
    <button onClick={save}>save</button>
    </>
    )
}

export default Deck