
interface CardParams {
  set?: string;
  collector_number?: number;
}

export const searchCards = async (params: CardParams) => {
    const { set, collector_number} = params;

    var url = `https://api.scryfall.com/cards/${set}/${collector_number}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Scryfall search failed: ${res.status}`);
    }
    
    return res.json();
}