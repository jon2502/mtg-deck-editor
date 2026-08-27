"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from "@/context/deck_context"
import orderCategories from "@/components/orderCategories"
import {category} from "@/global"
import {searchCard} from "@/services/scryfall/GETCard"
import CardImage from "@/components/cardImage"

interface DeckProps {
  id: string;
}

const Deck = ({id}:DeckProps) => {
    const {toggleOverlaySettings} = useOverlayContext()
    const {deckinfo, importDeck} = useDeckContext()
    const [editable, setEditable] = useState<category[]>([])
    const [orderedCategories, setOrderedCategories] = useState<category[]>([])
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

    function createCards(category:category){
        return  <div className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5 mb-2.5'>
                    {category.cards.map((card)=>(
                        <div key={card.set+"/"+card.collector_number}>
                            <CardImage art={card.art} alttext={card.set+"/"+card.collector_number}/>
                            <p>{card.count}</p>
                            <div>
                                <button onClick={()=>toggleOverlaySettings("update-card", {oracleid:card.oracleid, set:card.set, collector_number:card.collector_number, index:category.index})}>
                                    Update
                                </button>
                                <button onClick={()=>toggleOverlaySettings("remove-card", {set:card.set, collector_number:card.collector_number, index:category.index})}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
    }

    useEffect(() =>{
        importDeck(id)        
    },[])

    useEffect(() =>{
        const orderedCategories = orderCategories(deckinfo)
        setOrderedCategories(orderedCategories)
    },[deckinfo])

    return (
    <>
    <div>
        <h1>{deckinfo?.name}</h1>
        <button onClick={()=>toggleOverlaySettings("add-category")}>Add category</button>
    </div>
    <section className='h-[75vh] overflow-auto overflow-x-hidden pr-3'>
        <div>
            {orderedCategories.map((category: category)=>(
                <div key={category.categoryName} className={`flex flex-col ${category.permissions.canDelete === true && category.permissions.canRename === true && 'ml-3.5'}`}>
                    {category.permissions.canDelete === false && category.permissions.canRename === false &&
                        <h5>{category.categoryName}</h5>
                    }
                    {category.permissions.canDelete === true && category.permissions.canRename === true &&
                        <div className='flex flex-row'>
                                    <h5>{category.categoryName}</h5>
                                    <div>
                                        <button>&#8593;</button>
                                        <button>&#8595;</button>
                                        <button>delete</button>
                                    </div>
                        </div>
                    }
                    {createCards(category)}
                </div>
            ))}
        </div>
    </section>
    <button onClick={save}>save</button>
    </>
    )
}

export default Deck