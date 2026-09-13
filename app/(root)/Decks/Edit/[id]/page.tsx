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
  const [format, setFormat] = useState(deckinfo.format)
  const [color, setColor] = useState('')
  

  const [saved, setSaved]= useState(false)

  const params = useParams<{ id: string }>()
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  
  useEffect(() =>{
    importDeck(params.id)
  },[])

  useEffect(()=>{
    generateBtns()
  },[page, totalpages, btnamount])

  useEffect(() =>{
    return () => {
      resetDeck()
    }
  }, [])

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
        console.log("not saved")
        toggleOverlaySettings("save")
        return
      }
      console.log("reseting deck")
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
            <AllCards page={page} name={name} format={format} color={color} setPage={setPage} setTotalpages={setTotalpages} setBtnamount={setBtnamount}/>
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