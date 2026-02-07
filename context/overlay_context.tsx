'use client'
import { createContext, useContext, useState } from 'react'

interface OverlayContextType  {
    setting: boolean,
    value: string,
    toggleOverlaySettings: (val:string) => void
    shutdown: () => void
}

const defaultOverlayContext: OverlayContextType = {
  setting: false,
  value: "",
  toggleOverlaySettings: () => {},
  shutdown:() => {}
}
 
const OverlayContext = createContext<OverlayContextType>(
  defaultOverlayContext
);

const settingOptionsAllowed = ["save", "create", "delete"]

export const Overlaysetting = ({children}: {children: React.ReactNode}) => {
    const [setting, setSetting] = useState(false)
    const [value, setValue]= useState("")

    const toggleOverlaySettings = (val:string) => {
       const check = settingOptionsAllowed.includes(val)
       if (check === true) {
        setValue(val)
        setSetting(true)
       }
    }

    const shutdown = () => {
        setValue("")
        setSetting(false)
    }

    return (
        <OverlayContext.Provider value={{setting, value, toggleOverlaySettings, shutdown}}>
            {children}
        </OverlayContext.Provider>
    )
}
export const useOverlayContext = () => useContext(OverlayContext)

