// ==UserScript==
// @name buildingBuilder_v0.9
// @author Rodrygors
// @version 0.9
// @grant Publico
// @description Script que segue o in game toturial para os edificios, completa a construção mais rápido(free only) e completa as missões do pop up Discord: Rodrygors#5516
// @match https://*/*&screen=main*
// ==/UserScript==
//******************************* READ ME: *******************************
//******************************* Dev Notes: *******************************
//27/07/25 -> v0.3
//Quest completer not yet online
//27/07/25 -> v0.9
//Basic functionality working
//******************* EDITAR ABAIXO DESTA LINHA: *************************
//DEFINIÇÕES GERAIS:
const alternarAldeia = 0; // 0 = Não muda de aldeia, e dá refresh após o tempo definido na variável delayRefreshPagina. // 1 = Muda de aldeia.
const delayRefreshPaginaMin = 60000; // EXEMPLOS: 60000 1 min || 90000 = 1.5 mins || 120000 = 2 mins || 300000 0 5 mins || 600000 10 mins
const delayRefreshPaginaMax = 90000; // EXEMPLOS:  60000 1 min || 90000 = 1.5 mins || 120000 = 2 mins || 300000 0 5 mins || 600000 10 mins
const delayBetweenActions = 1000 // // EXEMPLOS:  1000 1 sec
//******************* NAO EDITAR ABAIXO DESTA LINHA *********************
const safetyRefreshBuffer = 2000;

const buildingQuestBtnLabel = 'current-quest';
const completeBuildingBtnLabel = 'btn-instant-free';
const questCompleteBtnLabel = 'quest-complete-btn';

var delayRefreshPagina = Math.floor((Math.random() * delayRefreshPaginaMin) + delayRefreshPaginaMax); // ms

window.addEventListener('load', function() {
	refreshNext = false;

    var buildingButtonList = document.getElementsByClassName(buildingQuestBtnLabel);
    if(buildingButtonList.length > 0) {
		refreshNext = clickButton(buildingButtonList, buildingQuestBtnLabel || refreshNext);
	}

    setTimeout(function(){},delayBetweenActions);

    var completeBuildingButtonList = document.getElementsByClassName(completeBuildingBtnLabel);
    if(completeBuildingButtonList.length > 0) {
		refreshNext = clickButton(completeBuildingButtonList, buildingQuestBtnLabel || refreshNext);
	}

    setTimeout(function(){},delayBetweenActions);

    var completeQuestButtonList = document.getElementsByClassName(questCompleteBtnLabel);
    if(completeQuestButtonList.length > 0) {
		refreshNext = clickButton(completeQuestButtonList, buildingQuestBtnLabel || refreshNext);
	}

    console.log("done.\nrefreshing: " + refreshNext);
    setTimeout(function(){refresh();},refreshNext ? safetyRefreshBuffer : delayRefreshPagina);

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

function clickButton(buttonList, BtnLabel) {
	refreshNext = false;
	
    if(buttonList.length == 0) {
        console.log("No buttons found for " + BtnLabel);
        return;
    }

	console.log("button list: " + BtnLabel);
	console.log(buttonList);

	for (var i = 0; i < buttonList.length; i++) {
		if(buttonList[i].style[0] == undefined) {
			buttonList[i].click();
			console.log("clicked button:");
			console.log(buttonList[i]);

            if(BtnLabel == completeBuildingBtnLabel) {
                console.log("refreshing to check for other free completes");
				refreshNext = true;
				
            }
		}
		else {
			console.log("inactive button:" + buttonList[i]);
		}
		setTimeout(function(){},delayBetweenActions);
	}
    console.log("no more " + BtnLabel + "\nrefreshing next: " + refreshNext);
	return refreshNext;
}
