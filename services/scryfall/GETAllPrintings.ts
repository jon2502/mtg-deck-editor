
export const searchPrintings = async (oracle_id: string) => {
    var url = `https://api.scryfall.com/cards/search?order=released&q=oracleid:${oracle_id}&unique=prints`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Scryfall search failed: ${res.status}`);
    }
    
    return await res.json();
}