'use client'
import { createContext, useContext, useState } from 'react'

interface OverlayContextType  {
    setting: boolean,
    value: string
    toggleOverlay: () => void
}

const defaultOverlayContext: OverlayContextType = {
  setting: false,
  value: "",
  toggleOverlay: () => {}
}
 
const OverlayContext = createContext<OverlayContextType>(
  defaultOverlayContext
);

const settingOptions = ["save", "create"]

export const Overlaysetting = ({children}: {children: React.ReactNode}) => {
    const [setting, setSetting] = useState(false)
    const [value, setValue]= useState("")

    const toggleOverlay = () => {
        /*if(true){
            setSetting(true);
        } else {
            setSetting(false)
        }*/
    
    }

    return (
        <OverlayContext.Provider value={{setting,value, toggleOverlay}}>
            {children}
        </OverlayContext.Provider>
    )
}
export const useOverlayContext = () => useContext(OverlayContext)

