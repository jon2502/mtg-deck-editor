"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import { searchCards } from '@/services/scryfall/GETAllCards'
import Image from 'next/image';

type ImageUris = {
  small: string;
  normal: string;
  large: string;
}

type SingleFaceCard = {
  image_uris: ImageUris;
  card_faces: never;
}

type  MultiFaceCard = {
  image_uris: never;
  card_faces: { image_uris?: ImageUris }[];
};

const AllCards = () => {
  //search parameters
  const [name, setName] = useState('')
  const [format, setFormat] = useState('commander')
  const [color, setColor] = useState('')

  //pages and button info
  const [page, setPage] = useState(0)
  const [totalpages, setTotalpages] = useState(0)
  const [btnamount, setBtnamount] = useState(0)
  const [btnarray, setBtnarray] = useState<number[]>([])
  //list of cards
  const [cards, setCards] = useState([])

  const [position, setPosition] = useState({
    x: 0,
    y: 0
  })

  function generateBtns(){
    var half = Math.round(btnamount / 2)
    if(page + half >= totalpages){
      var end = totalpages
    } else if (page > half) {
      var end = page + half
    } else {
      var end = btnamount
    }
    var from = end - btnamount
    var values = []
    for (var i = from; i < end; i++) {
      values.push(i);
    }
    setBtnarray(values) 
  }

  async function fetchCards() {
    setPage(1)
    const res = await searchCards({ name, format, color, page })
    setCards(res.data)
    var val = Math.ceil(res.total_cards/ 175)
    setTotalpages(val)
    if(val < 10){
      setBtnamount(val)
    }else{
      setBtnamount(10)
    }
  }

  async function fetchNewPage() {
    const res = await searchCards({ name, format, color, page })
    setCards(res.data)
  }

  useEffect(()=>{
     fetchCards()
  },[name, format, color])

  useEffect(()=>{
    generateBtns()
  },[page, btnamount])

 useEffect(()=>{
    fetchNewPage()
  },[page])
  console.log(cards)
  return(
  <section className=''>
    <div>
      <button onClick={() => setPage(1)}>{"<<"}</button>
      <button onClick={() => setPage(page - 1)}>{"<"}</button>
      {btnarray.map((num)=>(
        <button key={num}
        className={num+1 === page ? 'active NavBtn' : 'NavBtn'}
        id={(num + 1).toString()}
        onClick={() => setPage(num + 1)}>
          {num+1}</button>
      ))}
      <button onClick={() => setPage(page + 1)}>{">"}</button>
      <button onClick={() => setPage(totalpages)}>{">>"}</button>
    </div>
    <div>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5'>
          {cards.map((card:{oracleID:string, name:string, mana_cost:string, type_line:string,} & (SingleFaceCard | MultiFaceCard))=>(
          <tr key={card.name}>
            <div className="relative w-full aspect-[5/7] bg-muted overflow-hidden">
              <Image
                src={card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal}
                alt="test"
                fill
              />
            </div>
          </tr>
        ))}
      </div>
    </div>
  </section>
  )
}

export default AllCards