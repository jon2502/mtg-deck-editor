
export const searchCard = async (set: string, collector_number:string) => {
    var url = `https://api.scryfall.com/cards/${set}/${collector_number}`;

    const res = await fetch(url);
    const result = await res.json();
    const data = {art:result.image_uris.normal}

    if (!res.ok) {
        throw new Error(`Scryfall search failed: ${res.status}`);
    }
    
    return data
}