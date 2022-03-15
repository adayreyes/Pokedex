let special_start = 10001;
let special_end = 10228;
let pokemon_end = 899;
let count = 1;



async function renderBasePokemons(){
    count = 1;
    if(!getById("list-card(1)")){
        getById("list-container").innerHTML = "";
            for(let i = 1; i < 20; i++){
            await getResponseAsJson(i);
            setCard(i);
        }
        editBaseRendering();
    }
}

function editBaseRendering(){
    disableButton("base-button");
    enableButton("special-button");
    getById("more-button").classList.remove("d-none");
}

function disableButton(id){
    getById(id).setAttribute("disabled","");
    getById(id).classList.remove("hover")
}

function enableButton(id){
    getById(id).removeAttribute("disabled","");
    getById(id).classList.add("hover")
}

function setCard(i){
    let list = getById("list-container");
    list.innerHTML += listCardTemplate(i);
}

function listCardTemplate(i){
    return `<div class="small-card bg-${responseAsJson["types"][0]["type"]["name"]}" onclick="showFullCard(${i})" id="list-card(${i})">
    <img id="small-pokemon-image(${i})" src="${responseAsJson["sprites"]["other"]["official-artwork"]["front_default"]}" alt="">
    <p id="small-pokemon-name(${i})">${titleCase(responseAsJson["name"].replaceAll("-"," "))}</p>
    </div>`
}

async function showFullCard(id){
    await getResponse(id);
    editFullContainer();
    
}

function initFavoritesExplore(){
    let favorite_icon = getById("favorite");
    if(favorites.length == 0){
        addToFavorites(favorite_icon);
        
    } else {
        checkFavorites(favorite_icon);
    }
    renderFavoritesExplore();
}

function renderFavoritesExplore(){
    let favorites_container = getById("favorites-container");
    favorites_container.innerHTML = "";
    if(favorites.lenght != 0){
        for(let i = 0; i < favorites.length; i++){
            favorites_container.innerHTML += smallCardTemplateExplore(i);
            setBackgroundSmall(i);
        }
    }
}

function removeFavoriteExplore(i,icon){
    favorites.splice(i,1);
    icon.src = "./img/favorite1.ico";
    if(favorites.length == 0){
        getById("favorites-section").classList.add("d-none")
    }
    save();
    renderFavoritesExplore()
}

function checkFavoritesExplore(icon){
    let bool = false;
    for(let i = 0; i < favorites.length; i++){
        if(favorites[i]["name"].includes(pokemon_name)){
            bool = true;
            removeFavoriteExplore(i,icon);
        }
    }
    if(!bool){
        addToFavoritesExplore(icon);
    }
}

function startExplore(){
    loadExplore();
    includeHTML();
}

function loadExplore(){
    let favorites_text = localStorage.getItem("favorites");
    if(favorites_text){
        favorites_text = JSON.parse(favorites_text);
        if(favorites_text.length != 0){
            favorites = favorites_text;
            getById("favorites-section").classList.remove("d-none")
            renderFavoritesExplore();
        } else{
            getById("favorites-section").classList.add("d-none")
        }
    }
}

function addToFavoritesExplore(icon){
    icon.src = "./img/favorite2.ico"
    pushPokemon()
    getById("favorites-section").classList.remove("d-none");
}

function editFullContainer(){
    let container = getById("full-screen-container");
    container.style.display = "flex";
    container.style.backgroundColor = `var(--${responseAsJson["types"][0]["type"]["name"]})`

}
function smallCardTemplateExplore(i){
    return `<div class="small-card" onclick="showFullCard('${favorites[i]["name"]}')" id="small-card(${i})">
    <img id="small-pokemon-image(${i})" src="${favorites[i]["img"]}" alt="">
    <p id="small-pokemon-name(${i})">${favorites[i]["edited_name"]}</p>
    </div>`
}



function endFullScreen(){
    getById("full-screen-container").style.display = "none"
}

function morePokemons(){
    if(getById("list-card(1)")){
        moreBasePokemons()
    } else if(getById("list-card(10001)")) {
        moreSpecialPokemons();
    }
}

function moreBasePokemons(){
    count += 20;
    if(count < pokemon_end){
        renderMoreBasePokemons();
    } else{
        alert("End of the list")
    }
}

function moreSpecialPokemons(){
    special_start += 20;
    if(special_start < special_end){
        renderMoreSpecialPokemons();
    } else{
        alert("End of the list")
    }
}

async function renderMoreBasePokemons(){
    for(let i = count; i < count + 20; i++){
        await getResponseAsJson(i);
        checkImage(i)
    }
}

async function renderMoreSpecialPokemons(){
    for(let i = special_start; i < special_start + 20; i++){
        await getResponseAsJson(i);
        checkImage(i);
    }
}

async function renderSpecialPokemons(){
    special_start = 10001;
    if(!getById("list-card(10001)")){
        getById("list-container").innerHTML = "";
        for(let i = 10001; i < 10020; i++){
            await getResponseAsJson(i);
            setCard(i)
        }
    } 
    editSpecialRendering()
}

function editSpecialRendering(){
    disableButton("special-button");
    enableButton("base-button");
    getById("more-button").classList.remove("d-none");

}

function checkImage(i){
    if(responseAsJson["sprites"]["other"]["official-artwork"]["front_default"]){
      setCard(i);
    }
}