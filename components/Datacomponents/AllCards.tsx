"use client";
import React, { useState, useEffect } from 'react'
import { searchCards } from '@/services/scryfall/GETAllCards'
import { useOverlayContext } from '@/context/overlay_context';
import { useDeckContext } from '@/context/deck_context';
import CardImage from "@/components/cardImage"


type ImageUris = {
  small: string;
  normal: string;
  large: string;
}

type SingleFaceCard = {
  image_uris: ImageUris;
  mana_cost: string
  type_line: string
  card_faces: never;
}

type  MultiFaceCard = {
  image_uris: never;
  mana_cost: never
  type_line: never
  card_faces: { 
    image_uris: ImageUris
    mana_cost?: string
    type_line: string
  }[];
};

type Card = {
  oracle_id:string;
  name:string;
} & (SingleFaceCard | MultiFaceCard)

const AllCards = ({cards}: {cards:Card[]}) => {
  const {toggleOverlaySettings} = useOverlayContext()

  const [position, setPosition] = useState({
    x: 0,
    y: 0
  })

  return(
  <>
    <div className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5'>
      {cards.map((card:{oracle_id:string, name:string} & (SingleFaceCard | MultiFaceCard))=>(
        <div key={card.oracle_id}>
          <CardImage art={card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal} alttext={card.oracle_id}/>
          <div>
            <p>{card.name}</p>
            {card.card_faces ? (
              <div>
                <p>{card.card_faces[0].type_line}//{card.card_faces[1].type_line}</p>
                {card.card_faces.some(face=>face.mana_cost) && (
                <p>{card.card_faces
                  .map(face => face.mana_cost)
                  .filter(cost => cost != "")
                  .join("//")}
                </p>
                )}
              </div>
            ):(
              <div>
                <p>{card.type_line}</p>
                {card.mana_cost && (<p>{card.mana_cost}</p>)}
              </div>
              
            )}
            <button onClick={() => toggleOverlaySettings("add-card",{oracleid:card.oracle_id})}>+</button>
          </div>
        </div>
      ))}
    </div>
  </>
  )
}

export default AllCards