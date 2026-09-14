"use client"
import AllCards from '@/components/Datacomponents/AllCards'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from '@/context/deck_context'
import { useParams } from 'next/navigation'
import Deck from '@/components/Datacomponents/Deck'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from "next/navigation";
import { searchCards } from '@/services/scryfall/GETAllCards'



const page =  () => {
  const {toggleOverlaySettings} = useOverlayContext()
  const {deckinfo, importDeck, resetDeck} = useDeckContext()

  const [page, setPage] = useState(1)
  const [totalpages, setTotalpages] = useState(0)
  const [btnamount, setBtnamount] = useState(10)
  const [btnarray, setBtnarray] = useState<number[]>([])

  const [name, setName] = useState('')
  const [format, setFormat] = useState('')
  const [color, setColor] = useState('')
  
  const [cards, setCards] = useState([])

  const [saved, setSaved]= useState(false)

  const params = useParams<{ id: string, format: string }>()
  
  useEffect(() =>{
    importDeck(params.id)
  },[])

  useEffect(()=>{
    setFormat(deckinfo.format)
  },[deckinfo])

  useEffect(()=>{
    if(deckinfo.isloading==true){return}
    generateBtns()
  },[page, totalpages, btnamount])

  useEffect(()=>{
    if(deckinfo.isloading==true){return}
    fetchCards()
    setPage(1)
  },[name, format, color])

  useEffect(()=>{
    if(deckinfo.isloading==true){return}
    fetchNewPage()
  },[page])

  useEffect(() =>{
    return () => {
      resetDeck()
    }
  },[])

  async function fetchCards() {
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
    var values :number[] = []
    for (var i = from; i < end; i++) {
      values.push(i+1);
    }
    setBtnarray(values) 
  }

  async function save() {
    fetch("http://localhost:3500/Save",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deckinfo)
    })
  }
  /*
  if(!saved){
        toggleOverlaySettings("save")
        return
      }
  function checkSavedStatus(saved:boolean) {

  }
  */
  return (
    <section>
      <section className='flex justify-center items-center gap-[2.5%]'>
        <div className='w-[45%] h-auto pr-3'>
          {btnamount > 0 &&
            <div className='mb-3'>
              <button className="navBtn bg-blue-900 mr-1" onClick={() => setPage(1)}>{"<<"}</button>
              <button className="navBtn bg-blue-900 mx-1" onClick={() => setPage(page - 1)}>{"<"}</button>
              {btnarray.map((num)=>(
                <button key={num}
                className={`navBtn mx-1 ${num == page ? 'bg-amber-900' : 'bg-blue-900'}`}
                id={(num).toString()}
                onClick={() => setPage(num)}>
                  {num}</button>
              ))}
              <button className="navBtn bg-blue-900 mx-1" onClick={() => setPage(page + 1)}>{">"}</button>
              <button className="navBtn bg-blue-900 ml-1" onClick={() => setPage(totalpages)}>{">>"}</button>
            </div>
          }
        </div>
        <div className='w-[45%] h-auto pr-3'>
          <h1>{deckinfo.name}</h1>
        </div>
      </section>
      <section className='flex justify-center items-center gap-[2.5%]'>
        <div className='w-[45%] h-[75vh] overflow-auto overflow-x-hidden pr-3'>
          {!deckinfo.isloading &&
            <AllCards cards={cards}/>
          }
        </div>
        <div className='w-[45%] h-[75vh] overflow-auto overflow-x-hidden pr-3'>
          {!deckinfo.isloading &&
            <Deck/>
          }
        </div>
      </section>
      <section>
        <button onClick={save}>Save</button>
      </section>
    </section>
  )
}

export default page