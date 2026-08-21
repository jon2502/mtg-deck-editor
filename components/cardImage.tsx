"use client";
import Image from 'next/image'

const cardImage = ({ art,alttext, }: { art:string, alttext:string}) => {
  return <div className="relative w-full aspect-5/7 bg-muted overflow-hidden">
        <Image
            src={art}
            alt={alttext}
            fill
            unoptimized
        />
    </div>
  
}

export default cardImage