'use client'
import { createContext, useContext, useState } from 'react'

interface OverlayContextType  {
    setting: boolean,
    value: string,
    extra: string|number,
    toggleOverlaySettings: (val:string, extra?:string|number) => void
    shutdown: () => void
}

const defaultOverlayContext: OverlayContextType = {
  setting: false,
  value: "",
  extra: "",
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
    const [extra, SetExtra]=useState<string | number>("")

    const toggleOverlaySettings = (val:string, extra?:string|number) => {
       const check = settingOptionsAllowed.includes(val)
       if (check === true) {
        setValue(val)
        setSetting(true)
        if (extra) {
            SetExtra(extra)
        }
       }
    }

    const shutdown = () => {
        setValue("")
        SetExtra("")
        setSetting(false)
    }

    return (
        <OverlayContext.Provider value={{setting, value, extra, toggleOverlaySettings, shutdown}}>
            {children}
        </OverlayContext.Provider>
    )
}
export const useOverlayContext = () => useContext(OverlayContext)

