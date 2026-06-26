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
        collector_number:string;
        art:string;
        oracleid:string;
    }>
    categories?: Array<{
        categoryName: string;
        cards: Array<{
            count: number;
            set:string; 
            collector_number:string;
            art:string;
            oracleid:string;
        }>
    }>
}>;
}

interface DeckContextType {
    decklist: Deckinfo[];
    deckinfo: Deckinfo;
    importDecks: () => void;
    importDeck: (id:string) => void;
    addCategory:(categoryName: string) => void;
    addCard: (categoryIndex:number, set:string, collectorNumber:string, art:string, oracleid:string) => void;
    updateCard: (
        count:number,
        selectedCategory:number,
        orginalCategory:number,
        set:string,
        selectedset:string,
        collectorNumber:string,
        selectedsetcollectorNumber:string, 
        cardData:{
         art:string;
         oracleid:string
    }) => void
    removeCard:(categoryIndex:number, set:string, collectorNumber:string) => void
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
    addCard:() => {},
    updateCard:() => {},
    removeCard:() => {}
}



export const DeckContext = createContext<DeckContextType>(deafultDeckContextType);

export const Decksetting = ({children}: {children: React.ReactNode}) => {
    const [deckinfo, setDeckinfo] = useState<Deckinfo>(deafultDeckContextType.deckinfo)
    const [decklist, setDecks] = useState([])
    const [saved, SetSaved]= useState(false)


    async function importDecks() {
        const response = await fetch (`http://localhost:3500/Decks`)
        const decks = await response.json()
        setDecks(decks)
    }

    async function importDeck(id: string) {
        //fetch deck
        const response = await fetch (`http://localhost:3500/Deck/${id}`)
        const deck = await response.json()
        console.log(deck)
        //wait for all categories to be done
        const deckExtraInfo = await Promise.all(
            // loop through each category in the deck
            deck.deck.map(async(category:{cards:[{set:string, collector_number:string}]})=>({
                // create a copy of categories
                ...category,
                // wait for all cards to be done
                cards: await Promise.all(
                // loop through each card in the category
                category.cards.map(async(card)=>{
                     // fetch the full card data from Scryfall using set and collector number
                    var newData = await searchCard(card.set, card.collector_number)
                    // merge the database card with the Scryfall card data into one object
                    return {...card, ...newData}
                }))
            }))
        )
        // set the deck state once with all the additional data
        setDeckinfo({...deck, deck:deckExtraInfo})
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
                deck: currentdeck.deck.map((category) =>
                    category.categoryName == "Main Deck"
                    ?{...category,
                        categories:[...category.categories!, newcategory]
                    }: category
                )
            })
        )
    }

    async function addCard(categoryIndex:number, set:string, collectorNumber:string, art:string, oracleid:string){
        const addedCard = {
            count: 1,
            set: set,
            collector_number: collectorNumber,
            art: art,
            oracleid: oracleid
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

    async function updateCard(
        count:number,
        selectedCategory:number,
        orginalCategory:number,
        set:string,
        selectedset:string,
        collectorNumber:string,
        selectedsetcollectorNumber:string,
        cardData:{art:string, oracleid:string}){

         const updatedCardInfo = {
            count: count,
            set: selectedset,
            collector_number: selectedsetcollectorNumber,
            art: cardData.art,
            oracleid: cardData.oracleid
        }

        setDeckinfo(
            currentdeck => ({
                ...currentdeck,
                deck: currentdeck.deck.map((category, index)=>
                    index == selectedCategory && selectedCategory != orginalCategory
                    //if true set up and object for the category with the cards inside
                    ? {...category,
                        cards:[...category.cards, updatedCardInfo]
                    }
                    : index == orginalCategory && selectedCategory != orginalCategory
                    ? {...category,
                        cards:[...category.cards.filter((card)=> `${card.set}${card.collector_number}` !== `${set}${collectorNumber}`)]
                    }:{
                        ...category,
                        cards: category.cards.map((card)=>
                            card.set == set && card.collector_number == collectorNumber
                            ? updatedCardInfo
                            : card
                        )})
                    }
                )
            )
    }

    async function removeCard(categoryIndex:number, set:string, collectorNumber:string){
        setDeckinfo(
            currentdeck => ({
                ...currentdeck,
                deck: currentdeck.deck.map((category, index)=>
                    index == categoryIndex
                    //if true set up and object for the category with the cards inside
                    ? {...category,
                        cards:[...category.cards.filter((card)=> `${card.set}${card.collector_number}` !== `${set}${collectorNumber}`)]
                    }
                    //else keep the cards of the category unchanged 
                    : category
                )
            })
        )
    }
    


    return (
        <DeckContext.Provider value={{deckinfo, decklist, importDecks, importDeck, addCategory, addCard, updateCard, removeCard}}>
            {children}
        </DeckContext.Provider>
    )
}
export const useDeckContext = () => useContext(DeckContext)
