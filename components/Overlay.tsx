"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useOverlayContext } from '@/context/overlay_context'
function overlay() {

  const {setting, value, extra, shutdown} = useOverlayContext()
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

  async function DeleteFunction(id:string|number){
    fetch(`http://localhost:3500/DeleteDeck/${id}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
    })
    shutdown()
  }

  if (!setting) return null
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
      break;
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
      break;
    case "delete":
      return <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
        <div>
          <h1>Are you sure that you want to delete this deck</h1>
          <button onClick={()=>DeleteFunction(extra)}>Yes</button>
          <button onClick={()=>shutdown()}>No</button>
        </div>
      </div>
      break;
    default:
      return <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
        <p>something went wrog</p>
      </div>
  }
}

export default overlay