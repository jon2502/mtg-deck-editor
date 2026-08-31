"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useOverlayContext } from '@/context/overlay_context'
import { useDeckContext } from "@/context/deck_context"
import { searchPrintings } from '@/services/scryfall/GETAllPrintings'
import orderCategories from '@/components/orderCategories'
import { category } from '@/global';
import { decodeAction } from 'next/dist/server/app-render/entry-base';

function overlay() {
  const [printings, setPrintings] = useState([])
  const [selectedCard, setselectedCard] = useState("");
  const [selectedcategory, setselectedcategory] = useState(0)
  const {setting, value, extra, shutdown} = useOverlayContext()
  const {deckinfo, importDecks, addcategory, addCard, updateCard, removeCard} = useDeckContext()
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
    const parent = extra.parentId
    addcategory(categoryName, parent)
    shutdown()
  }
  
  async function card(formData: FormData) {
    const categoryIndex = Number(formData.get("selectcategory") as string)
    const [set, collectorNumber] = (formData.get("selectPrinting") as string).split("/")
    addCard(1, categoryIndex, set, collectorNumber)
    shutdown()
  }

  async function update(formData: FormData,) {
    const [selectedset, selectedsetcollectorNumber] = (formData.get("selectPrinting") as string).split("/")
    const selectedcategory = Number(formData.get("selectcategory") as string)
    const orginalcategory = extra.index;
    const set = extra.set
    const collectorNumber = extra.collector_number
    updateCard(1, selectedcategory, orginalcategory, set, selectedset, collectorNumber, selectedsetcollectorNumber)
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

  function createCategoryOptions() {
    var orderedCategories = orderCategories(deckinfo)
    return orderedCategories.map((category:category) => (
        <option key={category.index} value={category.index}>{category.categoryName}</option>
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
        console.log(value)
        setselectedCard(`${extra.set}/${extra.collector_number}`);
        setselectedcategory(extra.index!)
      case "add-card":
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
            <select name="selectcategory" id="selectcategory" required>
                {createCategoryOptions()}
            </select>
            <select name="selectPrinting" id="selectPrinting" required>
              {createPrintingOptions()}
            </select>
            <button type='submit'>Create</button>
            <button onClick={()=>shutdown()}>Cancel</button>
          </form>
        </div>
      case "update-card":
        return <div className='overlay-display'>
          <h2>Add Card</h2>
          <form action={update}>
            <select name="selectcategory" id="selectcategory" value={selectedcategory} onChange={(e) => setselectedcategory(Number(e.target.value))} required>
              {createCategoryOptions()}
            </select>
            <select name="selectPrinting" id="selectPrinting" value={selectedCard} onChange={(e) => setselectedCard(e.target.value)} required>
              {createPrintingOptions()}
            </select>
            <button type='submit'>Create</button>
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