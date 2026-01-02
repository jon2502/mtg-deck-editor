"use client";
import React from 'react'
import { useState, useEffect } from 'react'

interface DeckProps {
  id: string;
}

interface Decktypes {
    name: string;
    deck: Array<{
        categoryName: string;
        cards: Array<{
            count: number;
            set:string; 
            collector_number:string
        }>
    }>;
}

const Deck = ({id}:DeckProps) => {
    const [deck, setDeck] = useState<Decktypes[]>([])

    async function save() {
        
    }

    async function importDeck() {
        console.log('test')
        const response = await fetch (`http://localhost:3500/Getdeck/${id}`)
        const deck = await response.json()
        console.log(deck)
        setDeck(deck)
    }

    async function editDeck() {
        //setDeck()
    }

    useEffect(()=>{
        editDeck()
    },[deck])

    useEffect(() =>{
        importDeck()
    },[])
        


    
    return (
        <section>
            <h1>{deck[0]?.name}</h1>
            {deck[0]?.deck.map((catagories)=>(
                <div key={catagories.categoryName}>
                    <p>{catagories.categoryName}</p>
                    {catagories.cards.map((card)=>(
                        <div key={card.collector_number}>

                        </div>
                    ))}
                </div>
                
            ))} 
            <button onClick={save}>save</button>
        </section>
    )
}

export default Deck