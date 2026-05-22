
export const searchCard = async (set: string, collector_number:string) => {
    var url = `https://api.scryfall.com/cards/${set}/${collector_number}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Scryfall search failed: ${res.status}`);
    }
    
    return res.json();
}