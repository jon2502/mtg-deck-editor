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
            {deck[0]?.deck[0]?.cards.map((card:{count:number, set:string, collector_number:string})=>(
                <p key={card.collector_number}>test</p>
            ))} 
            <button onClick={save}>save</button>
        </section>
    )
}

export default Deck