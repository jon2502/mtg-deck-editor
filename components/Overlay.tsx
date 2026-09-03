"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from "@/context/deck_context"
import { searchPrintings } from '@/services/scryfall/GETAllPrintings'
import { category } from '@/global';

function overlay() {
  const [printings, setPrintings] = useState([])
  const [selectedCard, setselectedCard] = useState("");
  const [selectedcategory, setselectedcategory] = useState(0)
  const {setting, value, extra, shutdown} = useOverlayContext()
  const {deckinfo, importDecks, addCategory, addCard, updateCard, removeCard} = useDeckContext()
  const router = useRouter()

  async function formAction(formData: FormData){
    const name = formData.get("name") as string
    const format = formData.get("format") as string
    fetch("http://localhost:3500/Create",{
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

  async function gencategory(formData: FormData) {
    const categoryName = formData.get("categoryname") as string
    const parent = extra.parentId!
    addCategory(categoryName, parent)
    shutdown()
  }
  
  async function card(formData: FormData) {
    const categoryIndex = Number(formData.get("selectcategory") as string)
    const count = Number(formData.get("cards"))
    const [set, collectorNumber] = (formData.get("selectPrinting") as string).split("/")
    addCard(count, categoryIndex, set, collectorNumber)
    shutdown()
  }

  async function update(formData: FormData,) {
    const [selectedset, selectedsetcollectorNumber] = (formData.get("selectPrinting") as string).split("/")
    const selectedcategory = Number(formData.get("selectcategory") as string)
    const count = Number(formData.get("cards"))
    const orginalcategory = extra.index!;
    const set = extra.set!
    const collectorNumber = extra.collector_number!
    updateCard(count, selectedcategory, orginalcategory, set, selectedset, collectorNumber, selectedsetcollectorNumber)
    shutdown()
  }

  async function deleteFunction(id:string){
    await fetch(`http://localhost:3500/Delete/${id}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
    })
    shutdown()
    importDecks()
  }

  // Functions for generating content in the overlay
  function createFormatOptions(){
    const formats = ["standard", "pioneer", "modern", "legacy", "vintage", "commander", "oathbreaker", "pauper"]
    return formats.map((format:string)=> (
      <option key={format} value={format}>{String(format).charAt(0).toUpperCase() + String(format).slice(1)}</option>
    ))
  }

  function createCategoryOptions() {
    return deckinfo.deck.map((category:category, index) => (
        <option key={index} value={index}>{category.categoryName}</option>
      ))
  }

  function createPrintingOptions() {
    return printings.map((printing:{set:string, collector_number:string, set_name:string}) => (
        <option
          key = {`${printing.set}-${printing.collector_number}`}
          value={`${printing.set}/${printing.collector_number}`}
        >
          {printing.set_name} #{printing.collector_number}
        </option>
      ))
  }

  useEffect(() => {
     switch(value){
      case "update-card":
        setselectedCard(`${extra.set}/${extra.collector_number}`);
        setselectedcategory(extra.index!)
      case "add-card":
        searchPrintings(extra.oracleid!).then(printings => setPrintings(printings.data))
      break
     }
  
}, [setting, value, extra])

  //Logic for 
  if (!setting) {
    return null
  } else {
  switch(value){
      case "save":
        return <div>
        <div className='overlay-display'>
          <div>
            <h1>progess not saved. Are you sure you want to continue? if you do all progress will be lost</h1>
            <button>Yes</button>
            <button>No</button>
          </div>
        </div>
        </div>
      case "create":
        return <div className='overlay-display'>
          <div>
              <form action={formAction}>
              <input type="text" id="name" name="name" required/>
              <select name="format" id="format" required>
                {createFormatOptions()}
              </select>
              <button type='submit'>
                Create New Deck
              </button>
            </form>
          </div>
        </div>
      case "add-category":
        return <div className='overlay-display'>
          <h2>Create new category</h2>
          <form action={gencategory}>
            <input type="text" name="categoryname" id="categoryname" />
            <button type='submit'>Create</button>
            <button onClick={()=>shutdown()}>Cancel</button>
          </form>
        </div>
      case "add-card":
        return <div className='overlay-display'>
          <h2>Add Card</h2>
          <form action={card}>
            <label htmlFor="cards">select number of copies you want to add to the deck</label>
            <input type="number" id="cards" name="cards" min="1" defaultValue="1"/>
            <select name="selectcategory" id="selectcategory" required>
                {createCategoryOptions()}
            </select>
            <select name="selectPrinting" id="selectPrinting" required>
              {createPrintingOptions()}
            </select>
            <button type='submit'>Add</button>
            <button onClick={()=>shutdown()}>Cancel</button>
          </form>
        </div>
      case "update-card":
        return <div className='overlay-display'>
          <h2>Add Card</h2>
          <form action={update}>
            <label htmlFor="cards">Amount of copies</label>
            <input type="number" id="cards" name="cards" min="1" defaultValue={extra.count}/>
            <select name="selectcategory" id="selectcategory" value={selectedcategory} onChange={(e) => setselectedcategory(Number(e.target.value))} required>
              {createCategoryOptions()}
            </select>
            <select name="selectPrinting" id="selectPrinting" value={selectedCard} onChange={(e) => setselectedCard(e.target.value)} required>
              {createPrintingOptions()}
            </select>
            <button type='submit'>Update</button>
            <button onClick={()=>shutdown()}>Cancel</button>
          </form>
        </div>
      case "remove-card":
        return <div className='overlay-display'>
          <div>
            <h1>Are you sure that you want to remove this from your deck deck</h1>
            <button onClick={()=>{removeCard(extra.index!, extra.set!, extra.collector_number!); shutdown();}}>Yes</button>
            <button onClick={()=>shutdown()}>No</button>
          </div>
        </div>
      case "delete":
        return <div className='overlay-display'>
          <div>
            <h1>Are you sure that you want to delete this deck</h1>
            <button onClick={()=>deleteFunction(extra.deckid!)}>Yes</button>
            <button onClick={()=>shutdown()}>No</button>
          </div>
        </div>
      default:
        return <div className='overlay-display'>
          <p>something went wrog</p>
        </div>
    }
  }

  
}

export default overlay