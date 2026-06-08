'use client'
import { createContext, useContext, useState } from 'react'

interface ExtraInfomation {
    deckid?: string,
    oracleid?: string,
    set?: string,
    collector_number?: string,
    index?: number,
}

interface OverlayContextType  {
    setting: boolean,
    value: string,
    extra: ExtraInfomation,
    toggleOverlaySettings: (val:string, extra?:ExtraInfomation) => void
    shutdown: () => void
}

const defaultOverlayContext: OverlayContextType = {
  setting: false,
  value: "",
  extra: {
    deckid: "",
    oracleid: "",
    set: "",
    collector_number: "",
    index: 0
  },
  toggleOverlaySettings: () => {},
  shutdown:() => {}
}
 
const OverlayContext = createContext<OverlayContextType>(
  defaultOverlayContext
);

const settingOptionsAllowed = ["save", "create","Add-Category", "Add-Card", "Update-Card", "delete"]

export const Overlaysetting = ({children}: {children: React.ReactNode}) => {
    const [setting, setSetting] = useState(false)
    const [value, setValue]= useState("")
    const [extra, SetExtra]=useState({})

    const toggleOverlaySettings = (val:string, extra?:ExtraInfomation) => {
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
        SetExtra({})
        setSetting(false)
    }

    return (
        <OverlayContext.Provider value={{setting, value, extra, toggleOverlaySettings, shutdown}}>
            {children}
        </OverlayContext.Provider>
    )
}
export const useOverlayContext = () => useContext(OverlayContext)

