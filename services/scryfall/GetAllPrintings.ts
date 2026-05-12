interface Pringingparams {
  oracle_id: string;
}

export const searchPrintings = async (params: Pringingparams) => {
    const {oracle_id} = params;

    var url = `https://api.scryfall.com/cards/search?order=released&q=oracleid:${oracle_id}&unique=prints`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Scryfall search failed: ${res.status}`);
    }
    
    return res.json();
}