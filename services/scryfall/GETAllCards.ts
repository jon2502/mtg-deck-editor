
interface SearchParams {
  name?: string;
  format?: string; // e.g. 'standard', 'modern'
  color?: string;
  page?: number;
  totalpages?: number;
}

export const searchCards = async (params: SearchParams) => {
    const { name, format, color, page} = params;
    let url = ""


    const searchIndex = [
        {value: name ? `name:${name}` : '' },
        {value: format ? `f:${format}` : '' },
        {value: color && format == "commander" ? `commander:${color}` : color ? `color:${color}` : ''}
    ]

    const queryString = searchIndex
        .map(filter => filter.value)
        .filter(Boolean) // Remove empty strings
        .join(' ');

    if (queryString == ""){
        //if queryString is empty get all paper cards
        url= (`https://api.scryfall.com/cards/search?q=(game%3Apaper)${page ? `&page=${page}` : ''}`)
    } else {
        //insert filterd content into url and use encodeURIComponent to encode character of the url
        url = (`https://api.scryfall.com/cards/search?q=${encodeURIComponent(queryString)}${page ? `&page=${page}` : ''}`)
    }
    
    //get all cards that matches search query
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Scryfall search failed: ${res.status}`);
    }
    
    return res.json();
}