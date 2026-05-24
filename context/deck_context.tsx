'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import {searchCard} from "@/services/scryfall/GETCard"

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
        art:string
    }>
}>;
}


interface DeckContextType {
    decklist: Deckinfo[];
    deckinfo: Deckinfo;
    importDecks: () => void
    importDeck: (id:string) => void
    addCategory:(categoryName: string) => void
    addCard: (categoryIndex:number, set:string, collectorNumber:string, art:string) => void
    
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
    addCategory:() => {},
    addCard:() => {}
}



export const DeckContext = createContext<DeckContextType>(deafultDeckContextType);

export const Decksetting = ({children}: {children: React.ReactNode}) => {
    const [deckinfo, setDeckinfo] = useState<Deckinfo>(deafultDeckContextType.deckinfo)
    const [decklist, setDecks] = useState([])
    const [saved, SetSaved]= useState(false)


    async function importDecks() {
        const response = await fetch (`http://localhost:3500/GetDecks`)
        const decks = await response.json()
        setDecks(decks)
    }

    async function importDeck(id: string) {
        const response = await fetch (`http://localhost:3500/Getdeck/${id}`)
        const deck = await response.json()
        setDeckinfo(deck)
    }

    async function addCategory(newCategoryName: string) {
        const newcategory = {
            categoryName: newCategoryName,
            cards: []
        }

        setDeckinfo(
            currentdeck => ({
                // create a copy of the current deck info
                ...currentdeck,
                /*create a new deck array with all the old content in it pluss the new one,
                this will then replace the old array and the content will re render*/
                deck: [...currentdeck.deck, newcategory]
            })
        )
    }

    async function addCard(categoryIndex:number, set:string, collectorNumber:string, art:string){
        const addedCard = {
            count: 1,
            set: set,
            collector_number: collectorNumber,
            art: art
        }
        
        setDeckinfo(
            currentdeck => ({
                ...currentdeck,
                deck: currentdeck.deck.map((category, index)=>
                    index == categoryIndex
                    //if true set up and object for the category with the cards inside
                    ? {...category,
                        cards:[...category.cards, addedCard]
                    }
                    //else keep the cards of the category unchanged 
                    : category
                )
            })
        )
    }

    async function addcardInfo(set:string, collectorNumber:string, art:string) {
        const cardData = {
            count: 1,
            set: set,
            collector_number: collectorNumber,
            art: art
        }

        setDeckinfo(
            currentdeck => ({
                ...currentdeck,
                deck: currentdeck.deck.map((category)=> ({
                    ...category,
                    cards: category.cards.map((card)=>
                        card.set == set && card.collector_number == collectorNumber
                        ? {...card,
                            cardData
                        }
                        : card
                )})
                )
            })
        )
    }


    return (
        <DeckContext.Provider value={{deckinfo, decklist, importDecks, importDeck, addCategory, addCard}}>
            {children}
        </DeckContext.Provider>
    )
}
export const useDeckContext = () => useContext(DeckContext)

