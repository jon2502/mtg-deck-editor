"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from "@/context/deck_context"
import { searchPrintings } from '@/services/scryfall/GETAllPrintings'
import { searchCard } from '@/services/scryfall/GETCard'

function overlay() {
  const [printings, setPrintings] = useState([])
  const [selected, setSelected] = useState("");
  const {setting, value, extra, shutdown} = useOverlayContext()
  const {deckinfo, importDecks, addCategory, addCard, updateCard} = useDeckContext()
  const router = useRouter()

  async function formAction(formData: FormData){
    const name = formData.get("name") as string
    const format = formData.get("format") as string
    fetch("http://localhost:3500/CreateDeck",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            format: format
          })
    })
    .then(res => res.json())
    .then(data => {
      router.push(`/Decks/Edit/${data._id}`)
    })
    shutdown()
  }

  async function category(formData: FormData) {
    const categoryName = formData.get("categoryname") as string
    addCategory(categoryName)
    shutdown()
  }
  
  async function card(formData: FormData) {
    console.log(formData)
    const categoryIndex = Number(formData.get("categoryname") as string)
    const [set, collectorNumber] = (formData.get("selectPrinting") as string).split("/")
    const cardData = await searchCard(set,collectorNumber)
    console.log(cardData)
    addCard(categoryIndex, set, collectorNumber, cardData.art, cardData.oracleid)
    shutdown()
  }

  async function update(formData: FormData,) {
    console.log(formData)
    const categoryIndex = Number(formData.get("categoryname") as string)
    //const [set, collectorNumber] = originaldata.split("/")
    const [newset, newcollectorNumber] = (formData.get("selectPrinting") as string).split("/")
    const cardData = await searchCard(newset,newcollectorNumber)
    console.log(cardData)
    //updateCard(categoryIndex, set, collectorNumber, cardData.art)
    shutdown()
  }

  async function DeleteFunction(id:string){
    await fetch(`http://localhost:3500/DeleteDeck/${id}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
    })
    shutdown()
    importDecks()
  }

  useEffect(() => {
     switch(value){
      case "Update-Card":
        setSelected(`${extra.set}/${extra.collector_number}`);
      case "Add-Card":
        searchPrintings(extra.oracleid!).then(printings => setPrintings(printings.data))
      break
     }
  
}, [setting, value, extra])

  if (!setting) {
    return null
  } else {
  switch(value){
      case "save":
        return <div>
        <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
          <div>
            <h1>progess not saved. Are you sure you want to continue? if you do all progress will be lost</h1>
            <button>Yes</button>
            <button>No</button>
          </div>
        </div>
        </div>
      case "create":
        return <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
          <div>
              <form action={formAction}>
              <input type="text" id="name" name="name" required/>
              <select name="format" id="format" required>
                <option value="standard">Standard</option>
                <option value="pioneer">Pioneer</option>
                <option value="modern">Modern</option>
                <option value="legacy">Legacy</option>
                <option value="vintage">Vintage</option>
                <option value="commander">Commander</option>
                <option value="oathbreaker">Oathbreaker</option>
                <option value="pauper">Pauper</option>
              </select>
              <button type='submit'>
                Create New Deck
              </button>
            </form>
          </div>
        </div>
      case "Add-Category":
        return <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
          <h2>Create new category</h2>
          <form action={category}>
            <input type="text" name="categoryname" id="categoryname" />
            <button type='submit'>Create</button>
            <button onClick={()=>shutdown()}>Cancel</button>
          </form>
        </div>
      case "Add-Card":
        return <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
          <h2>Add Card</h2>
          <form action={card}>
            <select name="selectCategory" id="selectCategory" required>
                {deckinfo.deck.map((category, index) => (
                  <option key={index} value={index}>{category.categoryName}</option>
                ))}
            </select>
            <select name="selectPrinting" id="selectPrinting" required>
              {printings.map((printing:{set:string, collector_number:string, set_name:string}) => (
                <option
                  key = {`${printing.set}-${printing.collector_number}`}
                  value={`${printing.set}/${printing.collector_number}`}
                >
                  {printing.set_name} #{printing.collector_number}
                </option>
              ))}
            </select>
            <button type='submit'>Create</button>
            <button onClick={()=>shutdown()}>Cancel</button>
          </form>
        </div>
      case "Update-Card":

        return <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
          <h2>Add Card</h2>
          <form action={update}>
            <select name="selectCategory" id="selectCategory" required>
                {deckinfo.deck.map((category, index) => (
                  <option key={index} value={index}>{category.categoryName}</option>
                ))}
            </select>
            <select name="selectPrinting" id="selectPrinting" value={selected} onChange={(e) => setSelected(e.target.value)} required>
              {printings.map((printing:{set:string, collector_number:string, set_name:string}) => (
                <option
                  key = {`${printing.set}-${printing.collector_number}`}
                  value={`${printing.set}/${printing.collector_number}`}
                  
                >
                  {printing.set_name} #{printing.collector_number}
                </option>
              ))}
            </select>
            <button type='submit'>Create</button>
            <button onClick={()=>shutdown()}>Cancel</button>
          </form>
        </div>
      case "delete":
        return <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
          <div>
            <h1>Are you sure that you want to delete this deck</h1>
            <button onClick={()=>DeleteFunction(extra.deckid!)}>Yes</button>
            <button onClick={()=>shutdown()}>No</button>
          </div>
        </div>
      default:
        return <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
          <p>something went wrog</p>
        </div>
    }
  }

  
}

export default overlay