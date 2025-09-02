import AllCards from '@/components/Datacomponents/AllCards'
//import Deck from '@/components/Datacomponents/Deck'
import React from 'react'

const page =  () => {
  return (
    <section className='flex'>
      <div className='w-[615px] h-[545px] overflow-auto overflow-x-hidden'>
        <AllCards/>
      </div>
      <div className='w-[615px] h-[545px] overflow-auto overflow-x-hidden'>
        <p>deck</p>
      </div>
    </section>
  )
}

export default page