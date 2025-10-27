"use client";
import React from 'react'
import { useState, useEffect } from 'react'

interface DeckProps {
  id: string;
}

const Deck = ({id}:DeckProps) => {
    const [deck, setDeck] = useState([])

    async function save() {
        
    }

    async function importDeck() {
        console.log('test')
        const response = await fetch (`http://localhost:3500/Getdeck/${id}`)
        const deck = await response.json()
        setDeck(deck)
    }
    importDeck()

    async function editDeck() {
        //setDeck()
    }

    useEffect(()=>{
        editDeck()
    },[deck])


    
    return (
        <section>
            <h1>Deck</h1>
            {deck.map((category:{categoryName:string, cards:[]})=>(
                <div>
                    <h1>{category.categoryName}</h1>
                    <div>
                        {category.cards.map((card:{count:number, set:string, collector_number:string})=>(
                            <p>test</p>
                        ))}
                    </div>
                </div>
            ))}
                
            <button onClick={save}>save</button>
        </section>
    )
}

export default Deck