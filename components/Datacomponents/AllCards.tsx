"use client";

import { useState, useEffect } from 'react'
import { searchCards } from '@/services/scryfall/GETAllCards'

const AllCards = () => {
  const [name, setName] = useState('')
  const [format, setFormat] = useState('commander')
  const [color, setColor] = useState('')
  const [page, setPage] = useState(1)
  const [totalpages, setTotalpages] = useState(0)
  const [btnamount, setBtnamount] = useState(0)
  const [cards, setCards] = useState([])

  async function fetchCards() {
    setPage(1)
    const res = await searchCards({ name, format, color, page })
    setCards(res.data)
    setTotalpages(Math.ceil(res.data.total_cards/ 175))
    if(totalpages < 10){
      setBtnamount(totalpages)
    }else{
      setBtnamount(10)
    }
  }
  async function fetchNextPage() {
      const res = await searchCards({ name, format, color, page })
      setCards(res.data)
  }

  useEffect(()=>{
     fetchCards()
  },[name, format, color])

  useEffect(()=>{
    fetchNextPage()
  },[page])


  return(
  <section className=''>
    {cards.map((card:{name:string, mana_cost:string, type_line:string})=>(
      <div key={card.name} className='flex'>
        <p>{card.name}</p>
        <p>{card.mana_cost}</p>
        <p>{card.type_line}</p>
      </div>
    ))}
  </section>
  )
}

export default AllCards