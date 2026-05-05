'use client'
import AllCards from '@/components/Datacomponents/AllCards'
import {useState, useEffect} from 'react'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from "@/context/deck_context"
import { useParams } from 'next/navigation'
import Deck from '@/components/Datacomponents/Deck'


const page =  () => {
  const [saved, SetSaved]= useState(false)
  const {toggleOverlaySettings} = useOverlayContext()
  const {deckinfo, importDeck}= useDeckContext()
  const params = useParams<{ id: string }>()

  function checkSavedStatus(saved:boolean) {
    if(!saved){
      toggleOverlaySettings("save")
    }
  }

  return (
    <section className='flex'>
      <div className='w-[615px] h-[545px] overflow-auto overflow-x-hidden'>
        <AllCards/>
      </div>
      <div className='w-[615px] h-[545px] overflow-auto overflow-x-hidden'>
        <Deck id={params.id}/>
      </div>
    </section>
  )
}

export default page