
export const searchCard = async (set: string, collector_number:string) => {
    var url = `https://api.scryfall.com/cards/${set}/${collector_number}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Scryfall search failed: ${res.status}`);
    }

    const result = await res.json();
    if('card_faces' in result){
        console.log("double faced")
        const data = {
            art:result.card_faces[0].image_uris.normal,
            oracleid:result.oracle_id
        }
        return data
    }else{
        const data = {
            art:result.image_uris.normal,
            oracleid:result.oracle_id
        }
        return data
    }
    
    
}