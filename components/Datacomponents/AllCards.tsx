"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import { searchCards } from '@/services/scryfall/GETAllCards'

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
    <table>
        <tbody>
          {cards.map((card:{name:string, mana_cost:string, type_line:string})=>(
          <tr key={card.name} className='flex'>
            <td>
              <div>
                <div>
                  <i>
                  </i>
                </div>
                <div>
                  <p onPointerMove={e => console.log(`mouse over ${card.name}`)}>{card.name}</p>
                </div>
              </div>
            </td>
            <td>
              <div>
                <p>{card.mana_cost}</p>
              </div>
            </td>
            <td>
              <div>
                <p>{card.type_line}</p>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
  )
}

export default AllCards