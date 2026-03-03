"use client"
import AllCards from '@/components/Datacomponents/AllCards'
import Deck from '@/components/Datacomponents/Deck'
import {useState, useEffect} from 'react'
import { useOverlayContext } from '@/context/overlay_context'
import { useRouter } from 'next/navigation'

const page =  async ({params}: {params: Promise<{ id:string }>}) => {
  const [saved, SetSaved]= useState(false)
  const {toggleOverlaySettings} = useOverlayContext()
  const id = (await params).id

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
        <Deck id={id}/>
      </div>
    </section>
  )
}

export default page