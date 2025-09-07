'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
//import { useState, useEffect } from 'react'

const page = () => {
  const router = useRouter()

  async function formAction(formData: FormData){
    const name = formData.get("name") as string
    const format = formData.get("format") as string
    console.log(name, format)
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
  }

  return (
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
  )
}

export default page