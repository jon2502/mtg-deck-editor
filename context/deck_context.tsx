'use client'
import { createContext, useContext, useState } from 'react'
import {Deckinfo, category} from "@/global"
import {searchCard} from "@/services/scryfall/GETCard"


interface DeckContextType {
    decklist: Deckinfo[];
    deckinfo: Deckinfo;
    importDecks: () => void;
    importDeck: (id:string) => void;
    resetDeck: () => void;
    addCategory:(categoryName: string, parentId: string) => void;
    deleteCategory: (index:number) => void;
    addCard: (count:number, categoryIndex:number, set:string, collectorNumber:string) => void;
    updateCard: (
        count:number,
        selectedcategory:number,
        orginalcategory:number,
        set:string,
        selectedset:string,
        collectorNumber:string,
        selectedsetcollectorNumber:string, 
        ) => void
    removeCard:(categoryIndex:number, set:string, collectorNumber:string) => void
}

const deafultDeckContextType: DeckContextType = {
    decklist: [],
    deckinfo: {
        name: "",
        format: "",
        color: "",
        _id: "",
        deck: [],
        isloading: true
    },
    importDecks:() => {},
    importDeck:() => {},
    resetDeck:() => {},
    addCategory:() => {},
    deleteCategory:() => {},
    addCard:() => {},
    updateCard:() => {},
    removeCard:() => {}
}



export const DeckContext = createContext<DeckContextType>(deafultDeckContextType);

export const Decksetting = ({children}: {children: React.ReactNode}) => {
    const [deckinfo, setDeckinfo] = useState<Deckinfo>(deafultDeckContextType.deckinfo)
    const [decklist, setDecks] = useState([])
    const [saved, SetSaved]= useState(true)

    // for removing cards
    function removefunction(category:category, set:string, collectorNumber:string) {
        return {
        ...category,
        cards:[...category.cards.filter((card)=> `${card.set}${card.collector_number}` !== `${set}${collectorNumber}`)]
        }
    }

    // for adding or updating cards
    function addfunction (category:category, card:{count:number,set:string,collector_number:string, art:string, oracleid:string}) {
        let exists = category.cards.some((cardInDeck)=>
            card.set == cardInDeck.set && card.collector_number == cardInDeck.collector_number
        )

        return {
            ...category,
            cards: exists
            ? category.cards.map((cardInDeck)=>
                card.set == cardInDeck.set && card.collector_number == cardInDeck.collector_number
                ? {...cardInDeck, count:cardInDeck.count + card.count }
                : cardInDeck
            )
            :[...category.cards, card]
        }
    }

    //generate card settings
    async function generatecard (count:number,set:string,collector_number:string){
        var newData = await searchCard(set, collector_number)
        return {
            count: count,
            set: set,
            collector_number: collector_number,
            art: newData.art,
            oracleid: newData.oracleid
        }
    }

    //imports all decks
    async function importDecks() {
        const response = await fetch (`http://localhost:3500/Decks`)
        const decks = await response.json()
        setDecks(decks)
    }

    //imports a single deck
    async function importDeck(id: string) {
        //fetch deck
        const response = await fetch (`http://localhost:3500/Deck/${id}`)
        const deck = await response.json()
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

    async function resetDeck() {
        setDeckinfo(deafultDeckContextType.deckinfo)
    }


    // Add new sub category to a main category
    async function addCategory(newcategoryName: string, parentId: string) {
        const calIndex = deckinfo.deck.findIndex(
            category => category.categoryName === parentId
        ) + 1

        const newcategory = {
            categoryName: newcategoryName,
            cards: [],
            type: "custom",
            parentId: parentId,
        }

        setDeckinfo(
            currentdeck => ({
                // create a copy of the current deck info
                ...currentdeck,
                /*create a new deck array with all the old content in it pluss the new one,
                this will then replace the old array and the content will re render*/
                deck: [...currentdeck.deck.toSpliced(calIndex, 0, newcategory)]
            })
        )
    }

    async function moveCategory() {
        return null
    }

    // delete a sub category and move its content to its parent main category
    async function deleteCategory(index:number) {
        const categoryContent = deckinfo.deck[index].cards
        const categoryName = deckinfo.deck[index].categoryName
        const parent = deckinfo.deck[index].parentId
        const parentContent = deckinfo.deck.find((category)=> category.categoryName === parent && category.type === "main")

        if(parentContent){
            setDeckinfo(
                currentdeck => ({
                    ...currentdeck,
                     deck: currentdeck.deck.filter((category)=> category.type === "main" || category.categoryName !== categoryName)
                })
            )
            categoryContent.forEach(card => {
                setDeckinfo(
                    currentdeck => ({
                        ...currentdeck,
                        deck: currentdeck.deck.map((category, index)=>
                            category.categoryName == parent && category.type == "main"
                            //if true set up and object for the category with the cards inside
                            ? addfunction(category, card)
                            //else keep the cards of the category unchanged 
                            : category
                        )
                    })
                )
                addfunction(parentContent, card)
            });
        }
    }

    async function addCard(count:number, categoryIndex:number, set:string, collectorNumber:string){
    
        const addedCard = await generatecard(count, set, collectorNumber)
        
        setDeckinfo(
            currentdeck => ({
                ...currentdeck,
                deck: currentdeck.deck.map((category, index)=>
                    index == categoryIndex
                    //if true set up and object for the category with the cards inside
                    ? addfunction(category, addedCard)
                    //else keep the cards of the category unchanged 
                    : category
                )
            })
        )
    }

    async function updateCard(
        count:number,
        selectedcategory:number,
        orginalcategory:number,
        set:string,
        selectedset:string,
        collectorNumber:string,
        selectedsetcollectorNumber:string
        ){

        const updatedCardInfo = await generatecard(count, selectedset, selectedsetcollectorNumber)

        setDeckinfo(
            currentdeck => ({
                ...currentdeck,
                deck: currentdeck.deck.map((category, index)=>
                    index == selectedcategory && selectedcategory != orginalcategory
                    ? addfunction(category, updatedCardInfo)
                    : index == orginalcategory && selectedcategory != orginalcategory
                    ? removefunction(category, set, collectorNumber)
                    :{
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
                    ? removefunction(category, set, collectorNumber)
                    //else keep the cards of the category unchanged 
                    : category
                )
            })
        )
    }

    return (
        <DeckContext.Provider value={{deckinfo, decklist, importDecks, importDeck, resetDeck, addCategory, deleteCategory, addCard, updateCard, removeCard}}>
            {children}
        </DeckContext.Provider>
    )
}
export const useDeckContext = () => useContext(DeckContext)