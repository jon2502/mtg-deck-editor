'use client'
import { createContext, useContext, useState } from 'react'

interface Deck {
  name: string;
  format: string;
  color: string;
  _id: string;
}

interface DeckContextType {
  decks: Deck[];
  importDecks: () => void
}

const deafultDeckContextType: DeckContextType = {
    decks:[],
    importDecks:() => {}
}



export const DeckContext = createContext<DeckContextType>(deafultDeckContextType);

export const Decksetting = ({children}: {children: React.ReactNode}) => {
    const [decks, setDecks] = useState([])

    async function importDecks() {
        const response = await fetch (`http://localhost:3500/GetDecks`)
        const decks = await response.json()
        setDecks(decks)
    }


    return (
        <DeckContext.Provider value={{decks, importDecks}}>
            {children}
        </DeckContext.Provider>
    )
}
export const useDeckContext = () => useContext(DeckContext)

