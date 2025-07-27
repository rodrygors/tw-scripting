// ==UserScript==
// @name farmer&wallDetector
// @author Rodrygors
// @version 1.1
// @grant Publico
// @description Script que envia quantiade de tropas diferentes para farms cheios, vazios e com ou sem muralha. Discord: Rodrygors#5516
// @match https://*/*screen=am_farm*
// ==/UserScript==
//******************************* READ ME: *******************************
//USAR MODELO A PARA SAQUE VAZIO
//USAR MODELO B PARA SAQUE CHEIO
//MANTER delayClickMinimo ACIMA DE 200 ms
//PARA ATACAR TODAS AS ALDEIAS INDEPENDENTEMENTE DO NIVEL DA MURALHA DEFINIR maxWallLevel = 20
//PARA REMOVER DO ASSISTENTE TODAS AS ALDEIA COM MURALHA ACIMA DO PRETENDIDO maxWalledVillageDistance = 0
//******************************* Dev Notes: *******************************
//02/12/22 -> v1.0
//   - Principais funcionalidade implementadas.
//   - Guarda no localStorage as coords para as aldeias com muralhas que serão usadas num script de praça (Para obter as coordenadas em memória: window.localStorage.getItem('villagesToBeWalled'))
//07/12/22 -> patch
//   - Bug em que o script fica preso devido a grupo não ter mais aldeias ou a aldeia não estar no grupo selecionado resolvido.
//11/12/22 -> TODO:
// ---> Utilizar o checkWalls() para verificar e/ou guardar coords no localStorage <---
//******************* EDITAR ABAIXO DESTA LINHA: *************************
//DEFINIÇÕES GERAIS:
const alternarAldeia = 0; // 0 = Não muda de aldeia, e dá refresh após o tempo definido na variável delayRefreshPagina. // 1 = Muda de aldeia.
const delayClickMinimo = 300; // ms
const delayClickMaximo = 500; // ms
const delayRefreshPagina = 300000; // EXEMPLOS: 120000 = 2 mins || 300000 0 5 mins || 600000 10 mins
//DEFINIÇÕES DE ENVIO DE ATAQUES:
const isFullSend = 1; // 1 = Caso não tenha tropas para atacar com um modelo, tenta usar o outro.
const activateModelCDistance = 0; // Distância a que o script vai tentar enviar ataques com o modelo C, ter em atenção que unidades estão selecionadas (difinir 0 para desativar modelo C)
//DEFINIÇÕES DO DETETOR DE MURALHA:
const maxWallLevel = 0; //Nivel máximo de muralha até ao qual é para atacar (definir como 20 para atacar todas)
const maxWalledVillageDistance = 18; // Distância a partir da qual aldeias com muralha acima do nivel estipulado são apagadas do assistente (definir como 0 para apagar todas)
//OUTRAS DEFINIÇÕES:
const saveinfoToLS = 1; // 1 = Guarda informação no LocalStorage para ser utilizado por outros scripts (até agora guarda as coordenadas das aldeias não atacadas por terem muralha para serem usadas num script de praça de reunião)
//******************* NAO EDITAR ABAIXO DESTA LINHA *********************
const safetyRefreshBuffer = 2000;
const PARTIAL_PLUNDER = "Saque parcial: os seus soldados saquearam tudo que encontraram.";
const FULL_PLUNDER = "Saque completo: os seus soldados saquearam tudo que conseguiam carregar."
var plunderList = [];
var visIndexModel = 0;
var lastLoadedMS = Date.now();
var delayClick = Math.floor((Math.random() * delayClickMinimo) + delayClickMaximo); // ms

window.addEventListener('load', function() {
    plunderList = document.getElementById("plunder_list").children[0].children;
    if(document.getElementsByClassName("vis")[0].children.length != 2) visIndexModel = 1;
    sendAttacks();
    console.log("plunderList: " + plunderList);
    setTimeout(function(){refresh();},delayRefreshPagina);

}, false);

function refresh() {
    if ( alternarAldeia == 0 ) location.reload();
    else {
        $('.groupRight').click();
        $('.arrowRight').click();
        try {document.getElementsByClassName('jump_link')[0].click();}
        finally {
        setTimeout(function(){location.reload();}, safetyRefreshBuffer);
        }
    }
}

function checkTroops(typeOfAttack){
    var modelSpearA = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][3].value;
    var modelSpearB = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][12].value;
    var currentSpear = parseInt(document.getElementById("spear").lastChild.textContent);

    var modelSwordA = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][4].value;
    var modelSwordB = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][13].value;
    var currentSword = parseInt(document.getElementById("sword").lastChild.textContent);

    var modelAxeA = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][5].value;
    var modelAxeB = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][14].value;
    var currentAxe = parseInt(document.getElementById("axe").lastChild.textContent);

    var modelScoutA = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][6].value;
    var modelScoutB = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][15].value;
    var currentScout = parseInt(document.getElementById("spy").lastChild.textContent);

    var modelLightA = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][7].value;
    var modelLightB = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][16].value;
    var currentLight = parseInt(document.getElementById("light").lastChild.textContent);

    var modelHeavyA = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][8].value;
    var modelHeavyB = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][17].value;
    var currentHeavy = parseInt(document.getElementById("heavy").lastChild.textContent);

    var modelKnightA = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][9].value;
    var modelKnightB = document.getElementsByClassName("vis")[visIndexModel].children[1].children[0][18].value;
    var currentKnight = parseInt(document.getElementById("knight").lastChild.textContent);


    if(typeOfAttack=='A') {
        return (modelSpearA <= currentSpear &&
                modelSwordA <= currentSword &&
                modelAxeA <= currentAxe &&
                modelScoutA <= currentScout &&
                modelLightA <= currentLight &&
                modelHeavyA <= currentHeavy &&
                modelKnightA <= currentKnight);
    }
    else if(typeOfAttack=='B') {
        return (modelSpearB <= currentSpear &&
                modelSwordB <= currentSword &&
                modelAxeB <= currentAxe &&
                modelScoutB <= currentScout &&
                modelLightB <= currentLight &&
                modelHeavyB <= currentHeavy &&
                modelKnightB <= currentKnight);
    }
}

function checkWalls(prevPlunderWallLevel, prevPlunderDistance, clickIndex, coords){
    if( prevPlunderDistance > maxWalledVillageDistance ){
        plunderList[clickIndex].children[0].children[0].click(); //delete plunder entry because its far away and has wall
        UI.ErrorMessage("Muralha a nivel " + prevPlunderWallLevel + " e a " + prevPlunderDistance + " campos.\nRelatório removido.", 5000); //REduzir clickIndex para compensar a aldeia a menos na lista
        return 1;
    }
    else {
        if(saveinfoToLS){
            sendInfoToLS('villagesToBeWalled', coords);
            UI.ErrorMessage("Aldeia guardada para destruir muralha.\<br>Aldeia: (" + coords + ")\<br>Wall Level: " + prevPlunderWallLevel + "\<br>Distância: " + prevPlunderDistance , 2000);
        }
        return 0;
    }
}

function countDown(refreshIntervalId, mensagemErro){
    clearInterval(refreshIntervalId);
    setInterval(function(){
        UI.ErrorMessage(mensagemErro + "\n(" + parseDelayRefreshPagina(delayRefreshPagina - (Date.now() - lastLoadedMS - safetyRefreshBuffer)) + ")", 950);
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
        var statusModelA = checkTroops('A'); //hn dá refresh???
        var statusModelB = checkTroops('B');
        console.log(clickIndex + " / " + (plunderList.length-1));
        if( ( ++clickIndex == 0 || clickIndex == 1 ) && plunderList[clickIndex].attributes.length == 0 ){
            hasVillageToAttack = 0;
        }
        else if( clickIndex >= plunderList.length ) {
            if( alternarAldeia == 0) countDown(refreshIntervalId, "Não há mais relatórios nesta aldeia.");
            else countDown(refreshIntervalId, "Não há mais relatórios nesta aldeia.");
        }
        else{
            var prevPlunderWallLevel = plunderList[clickIndex].children[6].textContent;
            var prevPlunderDistance = plunderList[clickIndex].children[7].textContent;
            try {
                var prevPlunderStatus = plunderList[clickIndex].children[2].children[0].attributes["data-title"].value;
                console.log("prev plunder " + prevPlunderStatus);
            }
            catch{
                prevPlunderStatus = PARTIAL_PLUNDER; //Caso relatório não tenha saque
            }

            var coords = plunderList[clickIndex].children[3].innerText.slice(0, -3).replace("(", "").replace(")", "").replace(" ", "");

            if(0 < activateModelCDistance && activateModelCDistance >= prevPlunderDistance && plunderList[clickIndex].children[10].children[0].attributes[1].value !== "return false"){
                plunderList[clickIndex].children[10].children[0].click(); //click C
                //UI.SuccessMessage(coords + " -> C");
                console.log('Ataque: C | Aldeia: ' + coords);
                if( prevPlunderWallLevel > maxWallLevel ){
                    coords = coords - checkWalls(prevPlunderWallLevel, prevPlunderDistance, clickIndex, coords);
                }
                hasVillageToAttack = 0;
            }
        }

        if(!hasVillageToAttack); //Skip the first couple of rows that have no information
        else if( prevPlunderWallLevel > maxWallLevel ){
            coords = coords - checkWalls(prevPlunderWallLevel, prevPlunderDistance, clickIndex, coords);
            //console.log("Lista de aldeias para destruir: " + window.localStorage.getItem('villagesToBeWalled'));
        }
        else if (statusModelA || statusModelB){
            //console.log(prevPlunderWallLevel + " > " + maxWallLevel + '?');
            console.log(prevPlunderStatus);

            if (statusModelA && prevPlunderStatus == PARTIAL_PLUNDER){ //caso o saque não venha cheio e o modelo A tenha tropas
                plunderList[clickIndex].children[8].children[0].click(); //click A
                console.log('Ataque: A | Aldeia: ' + coords);
                UI.SuccessMessage(coords + " -> A");
            }
            else if( statusModelB && prevPlunderStatus == FULL_PLUNDER) { //Caso modelo B tenha tropas e o saque tenha vindo cheio o
                plunderList[clickIndex].children[9].children[0].click(); //click B
                UI.SuccessMessage(coords + " -> B");
                console.log('Ataque: B | Aldeia: ' + coords);
            }
            else if(isFullSend){
                if (statusModelA){
                    plunderList[clickIndex].children[8].children[0].click(); //Insuficientes para modelo B, usar A
                    UI.SuccessMessage(coords + " -> A <br>(Tropas insuficientes para B.)");
                    console.log('Ataque: A (Insuficientes para B) | Aldeia: ' + coords);
                }
                else{
                    plunderList[clickIndex].children[9].children[0].click(); //Insuficientes para modelo A, usar B
                    UI.SuccessMessage(coords + " -> B <br>(Tropas insuficientes para A.)");
                    console.log('Ataque: B (Insuficientes para A)| Aldeia: ' + coords);
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
                countDown(refreshIntervalId, "Não há tropas suficientes. A aguardar para mudar de aldeia.");
            }
        }
    }, delayClick);
}