import React from 'react'
import { useState, useEffect } from 'react'

const page = () => {
  const [format, setFormat] = useState("")
  const [name, setName]= useState("")


  async function CreateDeck(){
    fetch("",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            format: format
          })
    })
  }

  return (
    <div>

      <button onClick={() => CreateDeck()}></button>
    </div>
  )
}

export default page