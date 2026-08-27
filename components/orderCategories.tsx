import {Deckinfo, category} from "@/global"

function orderCategories(deckinfo:Deckinfo) {
    var orderedCategories: category[] = []
    deckinfo.deck.map((category, index)=> {
        if(category.permissions.canDelete === false && category.permissions.canRename === false && ["Main Deck", "Commander", "Commanders"].includes(category.categoryName)){
            orderedCategories.push({...category, index})  
        }

    })

    deckinfo.deck.map((category, index)=> {
        if(category.permissions.canDelete === true && category.permissions.canRename === true){
            orderedCategories.push({...category, index})
        }
    })
    deckinfo.deck.map((category, index)=> {
        if(category.permissions.canDelete === false && category.permissions.canRename === false && !["Main Deck", "Commander", "Commanders"].includes(category.categoryName)){
            orderedCategories.push({...category, index})

        }
    })
    return orderedCategories
}

export default orderCategories