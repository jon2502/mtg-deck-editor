
interface SearchParams {
  name?: string;
  format?: string; // e.g. 'standard', 'modern'
  color?: string;
  page?: number;
  totalpages?: number;
}

export const searchCards = async (params: SearchParams) => {
    const { name, format, color, page, totalpages} = params;



    const searchIndex = [
        {value: name ? `name:${name}` : '' },
        {value: format ? `f:${format}` : '' },
        {value: color && format == "commander" ? `commander:${color}` : color ? `color:${color}` : ''}
    ]

    const queryString = searchIndex
        .map(filter => filter.value)
        .filter(Boolean) // Remove empty strings
        .join(' ');
    
    //insert filterd content into url and use encodeURIComponent to encode character of the url
    var url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(queryString)}${page ? `&page=${page}` : ''}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Scryfall search failed: ${res.status}`);
    }
    
    return res.json();
}