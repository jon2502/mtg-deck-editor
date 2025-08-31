import AllCards from '@/components/Datacomponents/AllCards'
import React from 'react'

const page =  () => {
  return (
    <section>
      <div className='w-[615px] h-[545px] overflow-auto overflow-x-hidden'>
        <AllCards/>
      </div>
    </section>
  )
}

export default page