"use client"
import React from 'react'
import { useOverlayContext } from '@/context/overlay_context'
function overlay() {
  const {setting, value, shutdown} = useOverlayContext()
  console.log(setting)
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
          <h1>Are you sure that you want to delete this deck</h1>
          <button>Yes</button>
          <button>No</button>
        </div>
      </div>
      break;
    case "delete":
      return <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
        <div>
          <h1>Are you sure that you want to delete this deck</h1>
          <button>Yes</button>
          <button>No</button>
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