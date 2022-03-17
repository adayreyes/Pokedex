let responseAsJson;
let favorites = [];
let pokemon_name,edited_name,img,pokemon_id,type,weight,height,hp,attack,defense,special_attack,special_defense,speed;
let stats = ["hp","attack","defense","spe-atk","spe-def","speed"];

function getById(id){
    return document.getElementById(id);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
}

function enter(event){
    if(event.keyCode == 13){
        getPokemon();
    }
}

function writeInHTML(id,text){
    getById(id).textContent = capitalizeFirstLetter(`${text}`);
}

function getPokemon(){
    let input = getById("input").value;
    if(input.length != 0){
        input = cleanInput(input); 
        getResponse(input);
    }
  
}

async function getResponse(poke){
    await getResponseAsJson(poke);
    checkPokemon();
}

async function getResponseAsJson(poke){
    let url = `https://pokeapi.co/api/v2/pokemon/${poke}`;
    let response = await fetch(url);
    if(response["ok"] == true){
        responseAsJson = await response.json();
    } else{
        responseAsJson = null
    }
}

function checkPokemon(){
    if(responseAsJson){
        setAllValues();
        showBigCard();
    } else{
        alert("I couldn't find that Pokemon :(")
    }
}

function setAllValues(){
    setAllInfo();
    setAllStats();
}

function setAllInfo(){
    pokemon_name = responseAsJson["name"];
    edited_name = editPokemonName();
    type = responseAsJson["types"][0]["type"]["name"];
    img = responseAsJson["sprites"]["other"]["official-artwork"]["front_default"];
    pokemon_id = responseAsJson["id"];
    weight = responseAsJson["weight"]/10;
    height = responseAsJson["height"]/10;
}

function setAllStats(){
    hp = responseAsJson["stats"][0]["base_stat"];
    attack = responseAsJson["stats"][1]["base_stat"];
    defense = responseAsJson["stats"][2]["base_stat"];
    special_attack = responseAsJson["stats"][3]["base_stat"];
    special_defense = responseAsJson["stats"][4]["base_stat"];
    speed = responseAsJson["stats"][5]["base_stat"];
}

function cleanInput(input){
    input = input.toLowerCase();
    input = input.replaceAll(" ","-");
    getById("input").value = "";
    return input
}

function editPokemonName(){
    edited_name = pokemon_name.replaceAll("-"," ");
    edited_name = titleCase(edited_name);
    return edited_name
}

function showBigCard(){
    checkIfInFavorites();
    writeHeader();
    writeMainInfo();
    renderStatistics();
    writeAllStats();
    appear("big-card");
}

function checkIfInFavorites(){
    let bool = false;
    let favorite_icon = getById("favorite");
        for(let i = 0; i < favorites.length; i++){
            if(favorites[i]["name"].includes(pokemon_name)){
            bool = true;;
            }
        }
    setRightIcon(bool,favorite_icon);
}

function setRightIcon(bool,favorite_icon){
    if(bool){
        favorite_icon.src = "./img/favorite2.ico"
    } else{
        favorite_icon.src = "./img/favorite1.ico"
    }
}

function writeHeader(){
    getById("pokemon-image").src = img;
    writeInHTML("pokemon-id",pokemon_id);
    setBackground("card-header");
}

function writeMainInfo(){
    writeInHTML("pokemon-name",edited_name);
    writeInHTML("pokemon-type",type);
    setBackground("pokemon-type-container");
    setWeightAndHeight();
}

function setBackground(id){
    let element = getById(id);
    element.className = "";
    element.classList.add(`bg-${type}`);
}

function setWeightAndHeight(){
    writeInHTML("pokemon-weight",weight);
    writeInHTML("pokemon-height",height);
}

function writeAllStats(){
    writeStat("hp",hp);
    writeStat("attack",attack);
    writeStat("defense",defense);
    writeStat("spe-atk",special_attack);
    writeStat("spe-def",special_defense);
    writeStat("speed",speed);
}

function renderStatistics(){
    let info_container = getById("info-container");
    info_container.innerHTML = "";
    for (let i = 0; i < stats.length; i++) {
        info_container.innerHTML += statTemplate(i);        
    }
}

function statTemplate(i){
    return `<div class="statistics-container">
    <span>${capitalizeFirstLetter(stats[i])}</span>
    <div class="progress-bar-container">
    <div class="progress-bar  ${stats[i]}"><span id="${stats[i]}"></span></div>
    <div class="max-stat">252</div>
    </div>
    </div>`
}

function writeStat(id,value){
    writeInHTML(id,value);
    let width_value = (value * 100)/252;
    document.getElementsByClassName(id)[0].style.width = `${width_value}%`;
}

function appear(card){
    let element = getById(card);
    element.style.animationPlayState = "running";
    let newone = element.cloneNode(true);
    element.parentNode.replaceChild(newone, element);
}

function initFavorites(){
    let favorite_icon = getById("favorite");
    if(favorites.length == 0){
        addToFavorites(favorite_icon);
        
    } else {
        checkFavorites(favorite_icon);
    }
    renderFavorites();
}

function checkFavorites(icon){
    let bool = false;
    for(let i = 0; i < favorites.length; i++){
        if(favorites[i]["name"].includes(pokemon_name)){
            bool = true;
            removeFavorite(i,icon);
        }
    }
    if(!bool){
        addToFavorites(icon);
    }
}

function addToFavorites(icon){
    icon.src = "./img/favorite2.ico"
    pushPokemon()
    getById("favorites-section").classList.remove("d-none");
}

function removeFavorite(i,icon){
    favorites.splice(i,1);
    icon.src = "./img/favorite1.ico";
    if(favorites.length == 0){
        getById("favorites-section").classList.add("d-none")
    }
    save();
    renderFavorites()
}

function pushPokemon(){
    favorites.push(favoritePokemon());
    save();
}

function favoritePokemon(){
    return {"name":`${pokemon_name}`,"edited_name":`${edited_name}`,"type":`${type}`,"img":`${img}`,"pokemon_id":`${pokemon_id}`,"weight":`${weight}`,"height":`${height}`,"stats":{"hp":`${hp}`,"attack":`${attack}`,"defense":`${defense}`,"special-attack":`${special_attack}`,"special-defense":`${special_defense}`,"speed":`${speed}`}}
}

function renderFavorites(){
    let favorites_container = getById("favorites-container");
    favorites_container.innerHTML = "";
    if(favorites.lenght != 0){
        for(let i = 0; i < favorites.length; i++){
            favorites_container.innerHTML += smallCardTemplate(i);
            setBackgroundSmall(i);
        }
    }
}

function setBackgroundSmall(i){
    let card = getById(`small-card(${i})`);
    card.className = "";
    card.classList.add(`small-card`,`bg-${favorites[i]["type"]}`)
}

function smallCardTemplate(i){
    return `<div class="small-card" onclick="showFavorite('${favorites[i]["name"]}')" id="small-card(${i})">
    <img id="small-pokemon-image(${i})" src="${favorites[i]["img"]}" alt="">
    <p id="small-pokemon-name(${i})">${favorites[i]["edited_name"]}</p>
    </div>`
}

async function showFavorite(id){
    await getResponse(id);
    window.scrollTo(top); 
}

function save(){
    let favorites_text = JSON.stringify(favorites);
    localStorage.setItem("favorites",favorites_text);
}

function load(){
    let favorites_text = localStorage.getItem("favorites");
    if(favorites_text){
        favorites_text = JSON.parse(favorites_text);
        if(favorites_text.length != 0){
            favorites = favorites_text;
            getById("favorites-section").classList.remove("d-none")
            renderFavorites();
        } else{
            getById("favorites-section").classList.add("d-none")
        }
    }
}

function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
      }
    }
  }