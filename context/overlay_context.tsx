'use client'
import { createContext, useContext, useState } from 'react'
 
const OverlayContext = createContext(false);

export const Overlaysetting = ({children}: {children: React.ReactNode}) => {
    const [setting, setSetting] = useState(false)

    return (
        <OverlayContext.Provider value={setting}>
            {children}
        </OverlayContext.Provider>
    )
}

export const useOverlayContext = () => useContext(OverlayContext)
