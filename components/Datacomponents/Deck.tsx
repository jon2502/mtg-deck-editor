import React from 'react'
import { useState, useEffect } from 'react'
const Deck = () => {
    const [deck, setDeck] = useState([])

    async function save() {
        
    }

    async function importDeck() {
        //setDeck()
    }

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