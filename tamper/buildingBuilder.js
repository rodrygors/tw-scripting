// ==UserScript==
// @name buildingBuilder
// @author Rodrygors
// @version 0.1
// @grant Publico
// @description Script que segue o in game toturial para os edificios, completa a construção mais rápido(free only) e completa as missões do pop up Discord: Rodrygors#5516
// @match https://*/*&screen=main*
// ==/UserScript==
//******************************* READ ME: *******************************
//******************************* Dev Notes: *******************************
//27/07/25 -> v0.1
//******************* EDITAR ABAIXO DESTA LINHA: *************************
//DEFINIÇÕES GERAIS:
const alternarAldeia = 0; // 0 = Não muda de aldeia, e dá refresh após o tempo definido na variável delayRefreshPagina. // 1 = Muda de aldeia.
const delayRefreshPaginaMin =  60000; // EXEMPLOS: 60000 1 min || 120000 = 2 mins || 300000 0 5 mins || 600000 10 mins
const delayRefreshPaginaMax = 120000; // EXEMPLOS:  60000 1 min || 120000 = 2 mins || 300000 0 5 mins || 600000 10 mins
//******************* NAO EDITAR ABAIXO DESTA LINHA *********************
const safetyRefreshBuffer = 2000;

var delayRefreshPagina = Math.floor((Math.random() * delayRefreshPaginaMin) + delayRefreshPaginaMax); // ms

window.addEventListener('load', function() {
    var buildingButtonList = document.getElementsByClassName("current-quest");
    var completeBuildingButtonList = document.getElementsByClassName("btn-instant-free");
    var completeQuestButtonList = document.getElementsByClassName("quest-complete-btn");

    if(buildingButtonList.length > 0) clickButton(buildingButtonList);
    if(buildingButtonList.length > 0) clickButton(completeBuildingButtonList);
    if(buildingButtonList.length > 0) clickButton(completeQuestButtonList);

    console.log("done: ");
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

function clickButton(buttonList) {
	console.log("button list: ");
	console.log(buttonList);

	for (var i = 0; i < buttonList.length; i++) {
		if (!buttonList[i].style[i] == "display") {
			buttonList[i].click();
			console.log("clicked button:" + buttonList[i]);
		}
		else {
			console.log("inactive button:" + buttonList[i]);
		}
	}
}
