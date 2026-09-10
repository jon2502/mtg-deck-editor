"use client"
import AllCards from '@/components/Datacomponents/AllCards'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from '@/context/deck_context'
import { useParams } from 'next/navigation'
import Deck from '@/components/Datacomponents/Deck'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from "next/navigation";


const page =  () => {
  const {toggleOverlaySettings} = useOverlayContext()
  const {deckinfo, importDeck, resetDeck} = useDeckContext()
  const [saved, setSaved]= useState(false)

  const params = useParams<{ id: string }>()
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  
  useEffect(() =>{
    importDeck(params.id)
  },[])

  useEffect(() =>{
    return () => {
      resetDeck()
    }
  }, [])

  /*
  if(!saved){
        console.log("not saved")
        toggleOverlaySettings("save")
        return
      }
      console.log("reseting deck")
  */
 
  function checkSavedStatus(saved:boolean) {

  }

  return (
    <section className='flex justify-center items-center gap-[2.5%]'>
      <div className='w-[45%] h-[75vh]'>
        {!deckinfo.isloading &&
          <AllCards/>
        }
      </div>
      <div className='w-[45%] h-[75vh]'>
        {!deckinfo.isloading &&
          <Deck/>
        }
      </div>
    </section>
  )
}

export default page