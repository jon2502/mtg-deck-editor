'use client'
import { createContext, useContext, useState } from 'react'

interface Deckinfo {
    name: string;
    format: string;
    color: string;
    _id: string;
    deck?: Array<{
    categoryName: string;
    cards: Array<{
        count: number;
        set:string; 
        collector_number:string
    }>
}>;
}


interface DeckContextType {
    deckinfo: Deckinfo[];
    importDecks: () => void
    importDeck: ({id}:{id: string}) => void
}

const deafultDeckContextType: DeckContextType = {
    deckinfo: [],
    importDecks:() => {},
    importDeck:() => {}
}



export const DeckContext = createContext<DeckContextType>(deafultDeckContextType);

export const Decksetting = ({children}: {children: React.ReactNode}) => {
    const [deckinfo, setDeckinfo] = useState([])

    async function importDecks() {
        const response = await fetch (`http://localhost:3500/GetDecks`)
        const decks = await response.json()
        console.log(decks)
        setDeckinfo(decks)
    }

    async function importDeck({id}:{id: string}) {
        console.log('test')
        const response = await fetch (`http://localhost:3500/Getdeck/${id}`)
        const deck = await response.json()
        console.log(deck)
        setDeckinfo(deck)
    }


    return (
        <DeckContext.Provider value={{deckinfo, importDecks, importDeck}}>
            {children}
        </DeckContext.Provider>
    )
}
export const useDeckContext = () => useContext(DeckContext)

