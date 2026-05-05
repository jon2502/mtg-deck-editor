'use client'
import { createContext, useContext, useState } from 'react'

interface Deckinfo {
    name: string;
    format: string;
    color: string;
    _id: string;
    deck: Array<{
    categoryName: string;
    cards: Array<{
        count: number;
        set:string; 
        collector_number:string
    }>
}>;
}


interface DeckContextType {
    decklist: Deckinfo[];
    deckinfo: Deckinfo;
    importDecks: () => void
    importDeck: (id:string) => void
    addCategory:(categoryName: string) => void
}

const deafultDeckContextType: DeckContextType = {
    decklist: [],
    deckinfo: {
        name: "",
        format: "",
        color: "",
        _id: "",
        deck: [
            {categoryName:"", cards:[]}
        ]
    },
    importDecks:() => {},
    importDeck:() => {},
    addCategory:() =>{}
}



export const DeckContext = createContext<DeckContextType>(deafultDeckContextType);

export const Decksetting = ({children}: {children: React.ReactNode}) => {
    const [deckinfo, setDeckinfo] = useState<Deckinfo>(deafultDeckContextType.deckinfo)
    const [decklist, setDecks] = useState([])

    async function importDecks() {
        const response = await fetch (`http://localhost:3500/GetDecks`)
        const decks = await response.json()
        setDecks(decks)
    }

    async function importDeck(id: string) {
        const response = await fetch (`http://localhost:3500/Getdeck/${id}`)
        const deck = await response.json()
        console.log(deck.deck)
        setDeckinfo(deck)
    }

    async function addCategory(newCategoryName: string) {
        const newcategory = {
            categoryName: newCategoryName,
            cards: []
        }
        deckinfo.deck.push(newcategory)
        console.log(deckinfo)
    }


    return (
        <DeckContext.Provider value={{deckinfo, decklist, importDecks, importDeck, addCategory}}>
            {children}
        </DeckContext.Provider>
    )
}
export const useDeckContext = () => useContext(DeckContext)

