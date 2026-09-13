"use client";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from "@/context/deck_context"
import {category} from "@/global"
import CardImage from "@/components/cardImage"



const Deck = () => {
    const {toggleOverlaySettings} = useOverlayContext()
    const {deckinfo, deleteCategory} = useDeckContext()
    const router = useRouter()


    function createCards(category:category, categoryindex:number){
        return  <div className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5 mb-2.5'>
                    {category.cards.map((card)=>(
                        <div key={card.set+"/"+card.collector_number}>
                            <CardImage art={card.art} alttext={card.set+"/"+card.collector_number}/>
                            <p>{card.count}</p>
                            <div>
                                <button onClick={()=>toggleOverlaySettings("update-card", {oracleid:card.oracleid, set:card.set, collector_number:card.collector_number, count:card.count, index:categoryindex})}>
                                    Update
                                </button>
                                <button onClick={()=>toggleOverlaySettings("remove-card", {set:card.set, collector_number:card.collector_number, index:categoryindex})}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
    }

    return (
    <>
        <div>
            {deckinfo.deck.map((category: category, index:number)=>(
                <div key={`${category.type == "custom" && category.parentId+"/"}${category.categoryName}`} className={`flex flex-col ${category.type == "custom" && 'ml-3.5'}`}>
                    {category.type == "main" &&
                            <>
                            <h5>{category.categoryName}</h5>
                            {category.categoryName != "Commander"  && category.categoryName != "Commanders"  &&
                                <button onClick={()=>toggleOverlaySettings("add-category", {parentId:category.categoryName})}>Add category</button>
                            }
                        </>
                    }
                    {category.type == "custom" &&
                        <div className='flex flex-row'>
                                <h5>{category.categoryName}</h5>
                                <div>
                                    {deckinfo.deck[index-1].parentId != null &&
                                        <button>&#8593;</button>
                                    }
                                    {deckinfo.deck[index+1].parentId != null &&
                                        <button>&#8595;</button>
                                    }
                                    <button onClick={()=>deleteCategory(index)}>Delete</button>
                                    <button>Rename</button>
                                </div>
                        </div>
                    }
                    {createCards(category, index)}
                </div>
            ))}
        </div>
    </>
    )
}

export default Deck