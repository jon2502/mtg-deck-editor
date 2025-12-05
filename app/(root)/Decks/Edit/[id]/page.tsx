import AllCards from '@/components/Datacomponents/AllCards'
import Deck from '@/components/Datacomponents/Deck'
//import Deck from '@/components/Datacomponents/Deck'
import React from 'react'
//<Deck id={id}/>
const page =  async ({params}: {params: Promise<{ id:string }>}) => {
  const id = (await params).id
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