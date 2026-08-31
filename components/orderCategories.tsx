import {Deckinfo, category} from "@/global"

function orderCategories(deckinfo:Deckinfo) {
    var mainCategories: category[] = []
    var mainDeckCategories: category[] = []
    var sideboardCategories: category[] = []
    var maybeboardCategories: category[] = []


    deckinfo.deck.map((category, index)=> {
        if(category.type == "main"){
            mainCategories.push({...category, index})
        }
        if(category.parentId == "Main Deck"){
            mainDeckCategories.push({...category, index})  
        }
        if(category.parentId == "Sideboard"){
            sideboardCategories.push({...category, index})  
        }
        if(category.parentId == "Maybeboard"){
            maybeboardCategories.push({...category, index})  
        }
  
    })
    
    var orderedCategories = mainCategories.sort((a,b)=> 
        a.order - b.order
    )

    

    return orderedCategories
}

export default orderCategories