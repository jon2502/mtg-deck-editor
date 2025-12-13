import React from 'react'

function overlay() {
  return (
    <div className='fixed bg-black/25 w-[100vw] h-[100vh] top-[0%] flex flex-col items-center content-center'>
        <div>
          <h1>Are you sure that you want to delete this deck</h1>
          <button>Yes</button>
          <button>No</button>
        </div>
        <div>
          <h1>overlay reminder to save</h1>
        </div>
    </div>
  )
}

export default overlay