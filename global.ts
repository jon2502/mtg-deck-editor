
export interface Deckinfo {
    name: string;
    format: string;
    color: string;
    _id: string;
    deck: Array<category>;
    isloading?: boolean 
}

export interface category {
    categoryName: string;
    cards: Array<card>;
    type: string;
    parentId?: string;
}

export interface card {
    count: number;
    set:string; 
    collector_number:string;
    art:string;
    oracleid:string;
}