// ==UserScript==
// @name farmer&wallDetector
// @author rodrygors
// @version 0.969
// @grant Publico
// @description Script que envia quantiade de tropas diferentes para farms cheios, vazios e com ou sem muralha
// @match https://*/*screen=am_farm*
// ==/UserScript==
//
//*******************READ ME:*************************
//USAR MODELO A PARA SAQUE VAZIO
//USAR MODELO B PARA SAQUE CHEIO
//MANTER delayClickMinimo ACIMA DE 200 ms
//PARA ATACAR TODAS AS ALDEIAS INDEPENDENTEMENTE DO NIVEL DA MURALHA DEFINIR maxWallLevel = 20
//PARA REMOVER DO ASSISTENTE TODAS AS ALDEIA COM MURALHA ACIMA DO PRETENDIDO maxWalledVillageDistance = 0
//
//******************* EDITAR ABAIXO DESTA LINHA *************************
const alternarAldeia = 0; // 0 = Não muda de aldeia, e dá refresh após o tempo definido na variável delayRefreshPagina. // 1 = Muda de aldeia.
const saveinfoToLS = 1; // 1 = Guarda informação no LocalStorage para ser utilizado por outros scripts
const isFullSend = 0; //1 = Caso não tenha tropas para atacar para usar um modelo, tenta usar o outro
const delayClickMinimo = 300; // ms
const delayClickMaximo = 800; // ms
const delayRefreshPagina = 600000; // ms 120000 = 2 mins || 300000 0 5 mins || 600000 10 mins
const maxWallLevel = 0; //Nivel máximo de muralha até ao qual é para atacar (definir como 20 para atacar todas)
const maxWalledVillageDistance = 24; // Distância a partir da qual aldeias com muralha acima do nivel estipulado são apagadas do assistente (definir como 0 para apagar todas)
//******************* NAO EDITAR ABAIXO DESTA LINHA *********************
var plunderList = [];
var lastLoadedMS = Date.now();
var delayClick = Math.floor((Math.random() * delayClickMinimo) + delayClickMaximo); // ms

window.addEventListener('load', function() {
    plunderList = document.getElementById("plunder_list").children[0].children;
    sendAttacks();
    console.log(plunderList);
    setInterval(function(){refresh();},delayRefreshPagina);

}, false);

function refresh() {
    if ( alternarAldeia == 0 ) location.reload();
    else {
        $('.groupRight').click();
        $('.arrowRight').click();
    }
}

function checkTroops(typeOfAttack){
    var modelSpearA = document.getElementsByClassName("vis")[0].children[1].children[0][3].value;
    var modelSpearB = document.getElementsByClassName("vis")[0].children[1].children[0][12].value;
    var currentSpear = parseInt(document.getElementById("spear").lastChild.textContent);

    var modelSwordA = document.getElementsByClassName("vis")[0].children[1].children[0][4].value;
    var modelSwordB = document.getElementsByClassName("vis")[0].children[1].children[0][13].value;
    var currentSword = parseInt(document.getElementById("sword").lastChild.textContent);

    var modelAxeA = document.getElementsByClassName("vis")[0].children[1].children[0][5].value;
    var modelAxeB = document.getElementsByClassName("vis")[0].children[1].children[0][14].value;
    var currentAxe = parseInt(document.getElementById("axe").lastChild.textContent);

    var modelScoutA = document.getElementsByClassName("vis")[0].children[1].children[0][6].value;
    var modelScoutB = document.getElementsByClassName("vis")[0].children[1].children[0][15].value;
    var currentScout = parseInt(document.getElementById("spy").lastChild.textContent);

    var modelLightA = document.getElementsByClassName("vis")[0].children[1].children[0][7].value;
    var modelLightB = document.getElementsByClassName("vis")[0].children[1].children[0][16].value;
    var currentLight = parseInt(document.getElementById("light").lastChild.textContent);

    var modelHeavyA = document.getElementsByClassName("vis")[0].children[1].children[0][8].value;
    var modelHeavyB = document.getElementsByClassName("vis")[0].children[1].children[0][17].value;
    var currentHeavy = parseInt(document.getElementById("heavy").lastChild.textContent);

    var modelKnightA = document.getElementsByClassName("vis")[0].children[1].children[0][9].value;
    var modelKnightB = document.getElementsByClassName("vis")[0].children[1].children[0][18].value;
    var currentKnight = parseInt(document.getElementById("knight").lastChild.textContent);

    if(typeOfAttack=='A') return (modelSpearA <= currentSpear && modelSwordA <= currentSword && modelAxeA <= currentAxe && modelScoutA <= currentScout && modelLightA <= currentLight && modelHeavyA <= currentHeavy && modelKnightA <= currentKnight);
    else if(typeOfAttack=='B') return (modelSpearB <= currentSpear && modelSwordB <= currentSword && modelAxeB <= currentAxe && modelScoutB <= currentScout && modelLightB <= currentLight && modelHeavyB <= currentHeavy && modelKnightB <= currentKnight);
}

function countDown(refreshIntervalId, mensagemErro){
    clearInterval(refreshIntervalId);
    setInterval(function(){
        UI.ErrorMessage(mensagemErro + "\n(" + parseDelayRefreshPagina(delayRefreshPagina - (Date.now() - lastLoadedMS)) + ")", 950);
    }, 1000);
}

function parseDelayRefreshPagina(delayRefreshPagina){
    if ( delayRefreshPagina <= 60000 ){
        return (parseInt(delayRefreshPagina / 1000) + " segundos");
    }
    else return (parseInt(delayRefreshPagina / 60000) + " minutos e " + parseDelayRefreshPagina(delayRefreshPagina % 60000));
}

function sendInfoToLS(name, info){
    var existingString = window.localStorage.getItem(name);
    var existingArray = [];

    if(existingString==null){
        existingString = " ";
    }
    else {
        existingArray = existingString.split(" ");
    }

    if (existingArray.includes(info));
    else {
        window.localStorage.setItem(name, existingString + info + " ");
        console.log("Village added to list to remove wall: " + info + "\nList of villages to have wall removed in LS: " + window.localStorage.getItem(name));
    }

}

function sendAttacks()
{
    var clickIndex = 0;
    window.localStorage.clear('villagesToBeWalled');

    var refreshIntervalId = setInterval(function() {
        //console.log(modelLight + ", " + currentLight);
        //console.log(modelScout + ", " + currentScout);
        var hasVillageToAttack = 1;
        var statusModelA = checkTroops('A');
        var statusModelB = checkTroops('B');

        if(plunderList[++clickIndex].attributes.length == 0){
            hasVillageToAttack = 0;
        }
        else{
            var prevPlunderWallLevel = plunderList[clickIndex].children[6].textContent;
            var prevPlunderDistance = plunderList[clickIndex].children[7].textContent;
            try {
                var prevPlunderStatus = plunderList[2].children[2].children[0].attributes["data-title"].value;
            }
            catch{
                prevPlunderStatus = "Saque parcial: os seus soldados saquearam tudo que encontraram.";
            }

            var coords = plunderList[clickIndex].children[3].innerText.slice(0, -3).replace("(", "").replace(")", "").replace(" ", "");
        }


        if(!hasVillageToAttack); //Skip the first couple of rows that have no information
        else if( prevPlunderWallLevel > maxWallLevel ){
            if( prevPlunderDistance > maxWalledVillageDistance ){
                plunderList[clickIndex].children[0].children[0].click(); //delete plunder entry because its far away and has wall
                UI.ErrorMessage("Muralha com nivel superior a " + maxWallLevel + " e a mais de " + maxWalledVillageDistance + " campos.\nRelatório removido.", 5000);
            }
            else {
                UI.InfoMessage("Nivel de muralha demasiado alto. \nAldeia ignorada.");
                if(saveinfoToLS){
                    sendInfoToLS('villagesToBeWalled', coords);
                    UI.ErrorMessage("Aldeia guardada para destruir muralha.\<br>Aldeia: (" + coords + ")\<br>Wall Level: " + prevPlunderWallLevel + "\<br>Distância: " + prevPlunderDistance , 2000);
                }
            }
            //console.log("Lista de aldeias para destruir: " + window.localStorage.getItem('villagesToBeWalled'));
        }
        else if( clickIndex >= plunderList.length ) {
            if( alternarAldeia == 0) countDown(refreshIntervalId, "Não há mais relatórios nesta aldeia.");
            else refresh();
        }
        else if (statusModelA || statusModelB){
            //console.log(prevPlunderWallLevel + " > " + maxWallLevel + '?');

            if (statusModelA && prevPlunderStatus == "Saque parcial: os seus soldados saquearam tudo que encontraram."){ //caso o saque não venha cheio e o modelo A tenha tropas
                plunderList[clickIndex].children[8].children[0].click(); //click A
                console.log('Ataque: A');
            }
            else if( statusModelB && prevPlunderStatus == "Saque completo: os seus soldados saquearam tudo que conseguiam carregar.") { //Caso modelo B tenha tropas e o saque tenha vindo cheio o
                plunderList[clickIndex].children[9].children[0].click(); //click B
                console.log('Ataque: B');
            }
            else {
                if (isFullSend && statusModelA){
                    plunderList[clickIndex].children[8].children[0].click(); //Insuficientes para modelo B, usar A
                    console.log('Ataque: A (Insuficientes para B)');
                }
                else{
                    plunderList[clickIndex].children[9].children[0].click(); //Insuficientes para modelo A, usar B
                    console.log('Ataque: B (Insuficientes para A)');
                }
            }
            //console.log("===============================================\nAldeia Currente / Total Aldeias: " + clickIndex + " / " + plunderList.length + "\nStatus modelos A / B: " + statusModelA + " / " + statusModelB + "\n===============================================");
        }
        else {
            if ( alternarAldeia == 0 ) {
                console.log("Tropas(ou algum uncaught error...) " + clickIndex);
                countDown(refreshIntervalId, "Não há tropas suficientes. A aguardar o refresh automático.");
            }
            else {
                $('.groupRight').click();
                $('.arrowRight').click();
            }

        }
    }, delayClick);
}