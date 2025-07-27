// ==UserScript==
// @name buildingBuilder
// @author Rodrygors
// @version 0.9.4
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
//27/07/25 -> v0.9.1
//Auto refresh to handle multiple order completes
//27/07/25 -> v0.9.2
//Added UI refresh timer
//27/07/25 -> v0.9.3
//Added smart refresh timer to refresh based on time loeft to quick build
//27/07/25 -> v0.9.4
//Added flags to enable / disable features
//******************* EDITAR ABAIXO DESTA LINHA: *************************
//DEFINIÇÕES GERAIS:
const alternarAldeia = false; // 0 = Não muda de aldeia, e dá refresh após o tempo definido na variável delayRefreshPagina. // 1 = Muda de aldeia.
const builderActive = false;
const quickFinishActive = true;
const questFinisherActive = true; //NOT WORKING ATM
const delayRefreshPaginaMin = 60000; // EXEMPLOS: 60000 1 min || 90000 = 1.5 mins || 120000 = 2 mins || 300000 0 5 mins || 600000 10 mins
const delayRefreshPaginaMax = 90000; // EXEMPLOS:  60000 1 min || 90000 = 1.5 mins || 120000 = 2 mins || 300000 0 5 mins || 600000 10 mins
const delayBetweenActions = 1000 // // EXEMPLOS:  1000 1 sec
//******************* NAO EDITAR ABAIXO DESTA LINHA *********************
const safetyRefreshBuffer = 2000;
const lastLoadedMS = Date.now();

const buildingQuestBtnLabel = 'current-quest';
const completeBuildingBtnLabel = 'btn-instant-free';
const questCompleteBtnLabel = 'quest-complete-btn';

var delayRefreshPagina = Math.floor((Math.random() * (delayRefreshPaginaMax - delayRefreshPaginaMin)) + delayRefreshPaginaMin); // ms

window.addEventListener('load', function() {
    console.log("refresh delay: " + delayRefreshPagina);

    var refreshNext = fetchAndClick();

    var nextOrderCompletionTime = "";
    try{
        console.log(document.getElementById('buildqueue').children[1].children[3].textContent);
        nextOrderCompletionTime = document.getElementById('buildqueue').children[1].children[3].textContent.split(" ")[2];
    }
    catch{
    }

    var lastLoadTimeString = parseTimeFromPM(new Date(lastLoadedMS).toLocaleTimeString().split(" ").map(String));

    var refreshDelay = getRefreshDelay(lastLoadTimeString, nextOrderCompletionTime);
    console.log("Refresh timer:", parseDelayRefreshPagina(refreshDelay));

    setTimeout(function(){refresh();},refreshNext ? safetyRefreshBuffer : refreshDelay);
    countDown("Refreshing in:", refreshNext ? safetyRefreshBuffer : refreshDelay);

}, false);

function refresh() {
    if ( alternarAldeia ) location.reload();
    else {
        $('.groupRight').click();
        $('.arrowRight').click();
        try {document.getElementsByClassName('jump_link')[0].click();}
        finally {
        setTimeout(function(){location.reload();}, safetyRefreshBuffer);
        }
    }
}

function fetchAndClick() {
    var refreshNext = false;

    if(builderActive) {
        var buildingButtonList = document.getElementsByClassName(buildingQuestBtnLabel);
        refreshNext = clickButton(buildingButtonList, buildingQuestBtnLabel) || refreshNext;
        setTimeout(function(){},delayBetweenActions);
    }
    if(quickFinishActive) {
        var completeBuildingButtonList = document.getElementsByClassName(completeBuildingBtnLabel);
        refreshNext = clickButton(completeBuildingButtonList, completeBuildingBtnLabel) || refreshNext;
        setTimeout(function(){},delayBetweenActions);
    }
    if(questFinisherActive) {
        var completeQuestButtonList = document.getElementsByClassName(questCompleteBtnLabel);
        refreshNext = clickButton(completeQuestButtonList, questCompleteBtnLabel) || refreshNext;
    }

    console.log("done.\nrefreshing now: " + refreshNext);
    return refreshNext;
}

function clickButton(buttonList, BtnLabel) {
	var refreshNext = false;

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

function countDown(mensagemErro, delay){
    setInterval(function(){
        UI.ErrorMessage(mensagemErro + "\n(" + parseDelayRefreshPagina(delay - (Date.now() - lastLoadedMS - safetyRefreshBuffer)) + ")", 950);
    }, 1000);
}

function parseDelayRefreshPagina(delayRefreshPagina){
    if ( delayRefreshPagina <= 60000 ){
        return (parseInt(delayRefreshPagina / 1000) + " seconds");
    }
    else return (parseInt(delayRefreshPagina / 60000) + " minutes and " + parseDelayRefreshPagina(delayRefreshPagina % 60000));
}

function parseTimeFromPM([timeTrim, suff]) {
    const [hours, minutes, seconds] = timeTrim.split(":").map(String);

    var pmHours = (parseInt(hours) + 12).toString();

    if (suff == "PM") return pmHours + ":" + minutes + ":" + seconds;
    else return hours + ":" + minutes + ":" + seconds;
}

function parseFromStringToMs(time){
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

function getRefreshDelay(lastLoadTime, nextBuildFinishTime) {
    if (nextBuildFinishTime == "") return delayRefreshPagina;

    var lastLoadTimeMs = parseFromStringToMs(lastLoadTime);
    var nextBuildFinishTimeMs = parseFromStringToMs(nextBuildFinishTime);

    if(lastLoadTimeMs > nextBuildFinishTimeMs) {
        nextBuildFinishTimeMs += parseFromStringToMs("23:59:59");
        //take 3 minutes from refresh timer to user quick completion
        return nextBuildFinishTimeMs - lastLoadTimeMs - 180000;
    }

    return nextBuildFinishTimeMs - lastLoadTimeMs - 180000;
}