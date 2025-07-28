// ==UserScript==
// @name buildingBuilder
// @author Rodrygors
// @version 1.0
// @grant Publico
// @description Script que segue o in game toturial para os edificios, completa a construção mais rápido(free only) e completa as missões de pop up Discord: Rodrygors#5516
// @match https://*/*&screen=main*
// ==/UserScript==
//******************************* READ ME: *******************************
//******************************* Dev Notes: *******************************
//27/07/25 -> v0.3
//Quest completer not yet onlines
//27/07/25 -> v0.9.6.9
//Script will now build farm or storage according to need (flags to controll this: farmMargin and storageMargin)
//Other general improvements
//27/07/25 -> v1.0
//All major functionalities are working check "DEFINIÇÕES GERAIS" for more info
//******************* EDITAR ABAIXO DESTA LINHA: *************************
//DEFINIÇÕES GERAIS:
const alternarAldeia = false; // 0 = Não muda de aldeia, e dá refresh após o tempo definido na variável delayRefreshPagina. // 1 = Muda de aldeia.

//Builder modes have priority as bellow
//If both questBuilderActive and resourcesBuilderActive are true, quest builds will be clicked before resources
const questBuilderActive = true;
const resourcesBuilderActive = true;
const quickFinishActive = true;
const questFinisherActive = true; //NOT WORKING ATM

//Script will check how much farm capacity is left, if current pop > capacity * farmMargin  then script willattempt to upgrade storage
//0.0 -> allways upgrade farm || 1.0 -> only upgrades farm current pop is equal to farm capacity || 99.0 -> never upgrade farm (why chose this??)
const farmMargin = 0.9;
//Script will check how much storage is left, and if building costs more than the storage capacity * storageMargin then script willattempt to upgrade storage
//0.0 -> allways upgrade storage || 1.0 -> only upgrades storage when building is more expensive than storage capacity || 99.0 -> never upgrade storage (why chose this??)
const storageMargin = 0.9;

const delayRefreshPaginaMin = 120000; // EXEMPLOS: 60000 1 min || 90000 = 1.5 mins || 120000 = 2 mins || 300000 0 5 mins || 600000 10 mins
const delayRefreshPaginaMax = 300000; // EXEMPLOS:  60000 1 min || 90000 = 1.5 mins || 120000 = 2 mins || 300000 0 5 mins || 600000 10 mins
//******************* NAO EDITAR ABAIXO DESTA LINHA *********************
const delayBetweenActions = 1000 // // EXEMPLOS:  1000 1 sec
const safetyRefreshBuffer = 2000;
const lastLoadedMS = Date.now();

const buildingQuestBtnLabel = 'current-quest';
const buildingQuestBtnClass = '.current-quest';
const completeBuildingBtnLabel = 'btn-instant-free';
const questCompleteBtnLabel = 'quest-complete-btn';

const mainBuildRowId = '#main_buildrow_main';
const barracksBuildRowId = '#main_buildrow_barracks';
const stableBuildRowId = '#main_buildrow_stable';
const smithBuildRowId = '#main_buildrow_smith';
const placeBuildRowId = '#main_buildrow_place';
const statueBuildRowId = '#main_buildrow_statue';
const marketBuildRowId = '#main_buildrow_market';
const woodBuildRowId = '#main_buildrow_wood';
const stoneBuildRowId = '#main_buildrow_stone';
const ironBuildRowId = '#main_buildrow_iron';
const farmBuildRowId = '#main_buildrow_farm';
const storageBuildRowId = '#main_buildrow_storage';
const hideBuildRowId = '#main_buildrow_hide';
const wallBuildRowId = '#main_buildrow_wall';

const queueFarmClass = '.buildorder_farm';

const storageCapacity = parseFloat(document.querySelector("#storage").textContent);
const currentPop = parseFloat(document.querySelector("#pop_current_label").textContent);
const farmCapacity = parseFloat(document.querySelector("#pop_max_label").textContent);

var delayRefreshPagina = Math.floor((Math.random() * (delayRefreshPaginaMax - delayRefreshPaginaMin)) + delayRefreshPaginaMin); // ms
var refreshNext = false;

if(questFinisherActive) {
    const mutationObserver = new MutationObserver(entries => {
        var toObserve = document.querySelector(".quest-title");
        if(toObserve == null || toObserve == undefined) return;

        const subMutationObserver = new MutationObserver(subEntry => {
            fetchAndClickQuests();
        })

        subMutationObserver.observe(toObserve.children[0], {childList: true, characterData: true});
        fetchAndClickQuests();
    })
    mutationObserver.observe(document.querySelector("#ds_body"), {attributes: true});
}

window.addEventListener('load', async function() {
    console.log("refresh delay: " + delayRefreshPagina);

    fetchAndClickBuilds();

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

function fetchAndClickBuilds() {

    if(questBuilderActive) {
        var buildingButton = document.getElementsByClassName(buildingQuestBtnLabel);
        clickButtons(buildingButton, buildingQuestBtnLabel);
    }
    if(resourcesBuilderActive) {
        clickResourceBuildingButton();
    }
    if(quickFinishActive) {
        var completeBuildingButtonList = document.getElementsByClassName(completeBuildingBtnLabel);
        clickButtons(completeBuildingButtonList, completeBuildingBtnLabel);
    }

    console.log("done with build.\nrefreshing now: " + refreshNext);
}

function fetchAndClickQuests() {
    var completeQuestButtonList = document.getElementsByClassName(questCompleteBtnLabel);
    clickButtons(completeQuestButtonList, questCompleteBtnLabel);

    console.log("done with quests.\nrefreshing now: " + refreshNext);
}

function clickResourceBuildingButton() {
    var buildingToBuildButton = dynamicButtonChooser3000();

    if(isButtonAvailable(buildingToBuildButton)) {
        buildingToBuildButton.click();
    }
    else {
        console.log("Invalid button for resourcesBuilder mode: ");
        console.log(buildingToBuildButton);
    }
}

function clickButtons(buttonList, BtnLabel) {
    if(buttonList.length == 0) {
        console.log("No buttons found for " + BtnLabel);
        return;
    }

	console.log("button list: " + BtnLabel);
	console.log(buttonList);

	for (var i = 0; i < buttonList.length; i++) {
        if(BtnLabel == buildingQuestBtnLabel) {
            clickBuildButton(buttonList[i], BtnLabel);
        }
		else if(isButtonAvailable(buttonList[i])) {
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
}

function clickBuildButton(button, BtnLabel) {
    if(!isButtonAvailable(button)){
        console.log("Invalid button for " + BtnLabel + ":");
        console.log(button);
        return;
    }

    var buildingName = getBuildingNameFromButton(button);
    var buildingRowId = getRowIdFromBuildingName(buildingName);

    if(isFarmUpgradeNeeded()) {
        var farmButton = getBuildingButtonFromRow(farmBuildRowId);
        if (isButtonAvailable(farmButton)) {
            console.log("Farm needs upgrade!");
            button = farmButton;
        }
    }

    if(isStorageUpgradeNeeded(buildingRowId, storageCapacity)) {
        var storageButton = getBuildingButtonFromRow(storageBuildRowId);
        if (isButtonAvailable(storageButton)) {
            console.log("Storage needs upgrade!");
            button = storageButton;
        }
    }
    console.log("clicking quest building:");
    console.log(button);
    button.click();
}

function dynamicButtonChooser3000() {
    var resourceBuildingRows = [woodBuildRowId, stoneBuildRowId, ironBuildRowId];

    var lowestResourceBuildingLevel = 99;
    var buildingToBuildRowId;
    var buildingToBuildButton;

    for(var i=0; i<resourceBuildingRows.length; i++) {
        var buildingButton = getBuildingButtonFromRow(resourceBuildingRows[i]);
        var currBuildingName = buildingButton.getAttribute("data-building")

        //Check if building button is available
        if(isBuildingMaxedOut(resourceBuildingRows[i])) {
            console.log("Cannot build " + currBuildingName + "!");
            continue;
        }

        //Check if button is unavailable
        if(!isButtonAvailable(buildingButton)) {
            console.log("Can't build " + currBuildingName + "!");
            console.log(buildingButton);
            continue;
        }

        var buildLevel = getBuildingLevelFromButton(buildingButton);

        if (buildLevel < lowestResourceBuildingLevel) {
            lowestResourceBuildingLevel = buildLevel;
            buildingToBuildRowId = resourceBuildingRows[i];
            buildingToBuildButton = buildingButton;
        }
    }

    if (isButtonAvailable(buildingToBuildButton)) {
        console.log("lowest resource: " + getBuildingNameFromButton(buildingToBuildButton) + " (level " + getBuildingLevelFromButton(buildingToBuildButton) + ")");
        console.log(buildingToBuildButton);
    }

    if(isStorageUpgradeNeeded(buildingToBuildRowId, storageCapacity)) {
        var storageButton = getBuildingButtonFromRow(storageBuildRowId);
        if (isButtonAvailable(storageButton)) {
            console.log("Storage needs upgrade!");
            buildingToBuildButton = storageButton;
        }
    }

    if(isFarmUpgradeNeeded()) {
        var farmButton = getBuildingButtonFromRow(farmBuildRowId);
        if (isButtonAvailable(farmButton)) {
            console.log("Farm needs upgrade!");
            buildingToBuildButton = farmButton;
        }
    }

    return buildingToBuildButton;
}

function getBuildingButtonFromRow(buildingRow) {
    return document.querySelector(buildingRow).children[6].children[1];
}

function isBuildingMaxedOut(buildingRow) {
    return document.querySelector(buildingRow).children[1].getAttribute("class") == "inactive center";
}

function getBuildingNameFromButton(buildingButton) {
    return buildingButton.getAttribute("data-building");
}

function getBuildingLevelFromButton(buildingButton) {
    return parseInt(buildingButton.getAttribute("data-level-next")) - 1;
}

function isButtonAvailable(button) {
    return !(button == null || button == undefined || button.getAttribute("style") == "display:none" || button.getAttribute("style") == "display: none");
}

function isStorageUpgradeNeeded(buildingToBuildRowId, storageCapacity) {
    if(buildingToBuildRowId == undefined) return false;

    for(var i = 1; i<=3; i++){
        var requiredResources = parseFloat(document.querySelector(buildingToBuildRowId).children[i].getAttribute("data-cost"));
        if(requiredResources > (storageCapacity * 0.8)) {
            console.log("Need more resources: " + requiredResources + " > " + storageCapacity + " * 0.8");
            return true;
        }
    }
    return false;
}

function isFarmUpgradeNeeded() {
    if(isFarmOnQueue()) return false;
    return currentPop >= farmCapacity * farmMargin;
}

function isFarmOnQueue() {
    var farmOnQueue = document.querySelector(queueFarmClass);
    return !(farmOnQueue == null);
}

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRowIdFromBuildingName(buildingName) {
    switch (buildingName){
        case "main":
            return mainBuildRowId;
        case "barracks":
            return barracksBuildRowId;
        case "stable":
            return stableBuildRowId;
        case "smith":
            return smithBuildRowId;
        case "place":
            return placeBuildRowId;
        case "statue":
            return statueBuildRowId;
        case "market":
            return marketBuildRowId;
        case "wood":
            return woodBuildRowId;
        case "stone":
            return stoneBuildRowId;
        case "iron":
            return ironBuildRowId;
        case "farm":
            return farmBuildRowId;
        case "storage":
            return storageBuildRowId;
        case "hide":
            return hideBuildRowId;
        case "wall":
            return wallBuildRowId;
        default:
            return undefined;
    }
}