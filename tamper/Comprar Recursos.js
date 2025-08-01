// ==UserScript==
// @name         Comprar Recursos V1 - 10X
// @description  Compra de Recursos automátivo
// @author       FunnyPocketBook, edited by Ruff
// @version      2.1
// @include      **screen=market&mode=exchange*
// ==/UserScript==
const incoming = "Entrada";
let topUp, price, stack, start;
let isBuying = false;
var config_atualizarPagina = 1;
var recarregarEntre = 1000;
var recarregarAte = 2000;
let CompraMadeiraCheck, CompraArgilaCheck, CompraFerroCheck;


createInput();


if (localStorage.start == 'true') {
    start = true;
    document.getElementById("start").innerHTML = "Parar";
} else {
    start = false;
    document.getElementById("start").innerHTML = "Começar";
}
if (localStorage.ComprarMadeira == 'true') {
    CompraMadeiraCheck = true;
    document.getElementById("woodCheck").checked = true;
} else {
    CompraMadeiraCheck = false;
    document.getElementById("woodCheck").checked = false;
}

if (localStorage.ComprarArgila == 'true') {
    CompraArgilaCheck = true;
    document.getElementById("stoneCheck").checked = true;
} else {
    CompraArgilaCheck = false;
    document.getElementById("stoneCheck").checked = false;
}

if (localStorage.ComprarFerro == 'true') {
    CompraFerroCheck = true;
    document.getElementById("ironCheck").checked = true;
} else {
    CompraFerroCheck = false;
    document.getElementById("ironCheck").checked = false;
}
var botProtect = $('body').data('bot-protect');
if (botProtect !== undefined) {
    window.location.href = 'https://pt73.tribalwars.com.pt';
} else if (config_atualizarPagina == 1 && start == true) {
    var temp = random(recarregarEntre, recarregarAte);
    setInterval(function() {
        window.location.reload();
    }, temp);
    console.log("Tempo para recarregar a página: " + temp + " milisegundos");
}


function random(i, f) {
    if (i > f) {
        numInicial = f;
        numFinal = i + 1;
    } else {
        numInicial = i;
        numFinal = f + 1;
    }
    return Math.floor((Math.random() * (numFinal - numInicial)) + numInicial);
}

function createInput() {
    "use strict";
    const userInputParent = document.getElementById("premium_exchange_form"); // Parent element

    // Create input for setting how much res should be bought
    const divScript = document.createElement("div");

    divScript.setAttribute("id", "divScript");
    userInputParent.parentNode.insertBefore(divScript, userInputParent);
    document.getElementById("divScript").innerHTML =
        "<p>Comprar até total (Disponivel Aldeia + Recursos a Chegar): " + "<input id='topUpInput'> " + "<button id='topUpOk' class='btn'>OK</button> " + "<span id='topUpText'></span></p> " +
        "<p>Comprar quando preço for superior a : " + "<input id='priceInput'> " + "<button id='priceOk' class='btn'>OK</button> " + "<span id='priceText'></span></p>" +
        "<span style='color:red'>ATENÇÃO! Isso pode esgotar completamente os teus Pontos Premium!</span>" +
        "<p>Comprar Recursos:</p><p>" +
        "<input type=\"checkbox\"  name=\"wood\"   id=\"woodCheck\"> Madeira " +
        "<input type=\"checkbox\"  name=\"stone\"  id=\"stoneCheck\"> Argila " +
        "<input type=\"checkbox\"  name=\"iron\"   id=\"ironCheck\"> Ferro </p> " +
        "<p><button id='start' class='btn'></button></p>";

    if (localStorage.topUp) {
        document.getElementById("topUpInput").value = localStorage.topUp;
        topUp = localStorage.topUp;
    }
    if (localStorage.price) {
        document.getElementById("priceInput").value = localStorage.price;
        price = localStorage.price;
    }

}

document.getElementById("start").addEventListener("click", function() {
    if (localStorage.start == 'true') {
        start = false;
        localStorage.start = 'false';
        document.getElementById("start").innerHTML = "Começar";
        window.location.reload();
    } else {
        start = true;
        localStorage.start = 'true';
        document.getElementById("start").innerHTML = "Parar";
        window.location.reload();
    }
});
document.getElementById("topUpOk").addEventListener("click", function() {
    topUp = document.getElementById("topUpInput").value;
    localStorage.topUp = topUp;
    document.getElementById("topUpText").innerHTML = topUp;
});
document.getElementById("priceOk").addEventListener("click", function() {
    price = document.getElementById("priceInput").value;
    localStorage.price = price;
    document.getElementById("priceText").innerHTML = price;
});

document.getElementById("woodCheck").addEventListener("click", function() {
    if (localStorage.ComprarMadeira == "true") {
        localStorage.ComprarMadeira = "false";
        window.location.reload();
    } else {
        localStorage.ComprarMadeira = "true";
        window.location.reload();
    }
});
document.getElementById("stoneCheck").addEventListener("click", function() {
    if (localStorage.ComprarArgila == "true") {
        localStorage.ComprarArgila = "false";
        window.location.reload();
    } else {
        localStorage.ComprarArgila = "true";
        window.location.reload();
    }
});
document.getElementById("ironCheck").addEventListener("click", function() {
    if (localStorage.ComprarFerro == "true") {
        localStorage.ComprarFerro = "false";
        window.location.reload();
    } else {
        localStorage.ComprarFerro = "true";
        window.location.reload();
    }
});


document.getElementById("topUpInput").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#topUpOk"));
document.getElementById("priceInput").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#priceOk"));


/**
 *
 * @param wh Amount of resources in the warehouse
 * @param price Current price of the resource
 * @param stock Amount of resources in the premium exchange stock
 * @param inc Amount of incoming resources
 * @param input DOM Element of the text box
 * @param buy Amount of resources to buy
 * @constructor
 */
function Resource(wh, price, stock, inc, input) {
    this.wh = wh;
    this.price = price;
    this.stock = stock;
    this.inc = inc;
    this.inputBuy = input;
    this.buy = 0;
}

/**
 * Get all the info of the resources
 * @type {Resource}
 */
let wood = new Resource(game_data.village.wood, parseInt(document.querySelector("#premium_exchange_rate_wood > div:nth-child(1)").innerText), parseInt(document.querySelector("#premium_exchange_stock_wood").innerText), 0, document.querySelector("#premium_exchange_buy_wood > div:nth-child(1) > input"));
let iron = new Resource(game_data.village.iron, parseInt(document.querySelector("#premium_exchange_rate_iron > div:nth-child(1)").innerText), parseInt(document.querySelector("#premium_exchange_stock_iron").innerText), 0, document.querySelector("#premium_exchange_buy_iron > div:nth-child(1) > input"));
let stone = new Resource(game_data.village.stone, parseInt(document.querySelector("#premium_exchange_rate_stone > div:nth-child(1)").innerText), parseInt(document.querySelector("#premium_exchange_stock_stone").innerText), 0, document.querySelector("#premium_exchange_buy_stone > div:nth-child(1) > input"));
let warehouse = game_data.village.storage_max;


if (start) {
    buyRes();
}
const interval = setInterval(function() {
    var temp1 = random(150, 300);
    if (start && (!document.querySelector("#fader") || document.querySelector("#fader").style.display === "none")) {
        buyRes();
    }
}, temp1);

function buyRes() {
    getRes();

    // If buy everything is checked and warehouse + incoming resource of each resource is less than what the warehouse should be topped up to
    if (wood.wh + wood.inc < topUp || stone.wh + stone.inc < topUp || iron.wh + iron.inc < topUp) {
        if ((wood.price >= price && wood.wh + wood.inc < topUp && document.querySelector("#woodCheck").checked) && wood.stock >= price) {
            // Buy wood
            wood.buy = topUp - wood.wh - wood.inc;
            if (wood.buy > wood.stock && wood.stock >= ((price * 10) + 10)) {
                wood.buy = (price * 10);
            } else if (wood.buy > wood.stock && wood.stock >= ((price * 9) + 10)) {
                wood.buy = (price * 9);
            } else if (wood.buy > wood.stock && wood.stock >= ((price * 8) + 10)) {
                wood.buy = (price * 8);
            } else if (wood.buy > wood.stock && wood.stock >= ((price * 7) + 10)) {
                wood.buy = (price * 7);
            } else if (wood.buy > wood.stock && wood.stock >= ((price * 6) + 10)) {
                wood.buy = (price * 6);
            } else if (wood.buy > wood.stock && wood.stock >= ((price * 5) + 10)) {
                wood.buy = (price * 5);
            } else if (wood.buy > wood.stock && wood.stock >= ((price * 4) + 10)) {
                wood.buy = (price * 4);
            } else if (wood.buy > wood.stock && wood.stock >= ((price * 3) + 10)) {
                wood.buy = (price * 3);
            } else if (wood.buy > wood.stock && wood.stock >= ((price * 2) + 10)) {
                wood.buy = (price * 2);
            } else if (wood.buy >= wood.stock && wood.stock >= (price)) {
                wood.buy = price;
            }
            //stone.inputBuy.value = "";
            //iron.inputBuy.value = "";
            //wood.buy = setZeroIfNaN(wood.buy);
            if (wood.buy === 0) {
                clearInterval(interval);
                console.log("wood:");
                console.log(wood);
                alert("This error message shouldn't pop up. Please open the console with CTRL+Shift+J and send a message to the developer via Discord, FunnyPocketBook#9373");
                return;
            }
            //wood.inputBuy.value = wood.buy;
            if (!isBuying) {
                buy("wood", wood.buy);
            }
        } else if ((stone.price >= price && stone.wh + stone.inc < topUp && document.querySelector("#stoneCheck").checked && stone.stock >= price)) {
            // Buy stone
            stone.buy = topUp - stone.wh - stone.inc;
            if (stone.buy > stone.stock && stone.stock >= ((price * 10) + 10)) {
                stone.buy = (price * 10);
            } else if (stone.buy > stone.stock && stone.stock >= ((price * 9) + 10)) {
                stone.buy = (price * 9);
            } else if (stone.buy > stone.stock && stone.stock >= ((price * 8) + 10)) {
                stone.buy = (price * 8);
            } else if (stone.buy > stone.stock && stone.stock >= ((price * 7) + 10)) {
                stone.buy = (price * 7);
            } else if (stone.buy > stone.stock && stone.stock >= ((price * 6) + 10)) {
                stone.buy = (price * 6);
            } else if (stone.buy > stone.stock && stone.stock >= ((price * 5) + 10)) {
                stone.buy = (price * 5);
            } else if (stone.buy > stone.stock && stone.stock >= ((price * 4) + 10)) {
                stone.buy = (price * 4);
            } else if (stone.buy > stone.stock && stone.stock >= ((price * 3) + 10)) {
                stone.buy = (price * 3);
            } else if (stone.buy > stone.stock && stone.stock >= ((price * 2) + 10)) {
                stone.buy = (price * 2);
            } else if (stone.buy >= stone.stock && stone.stock >= (price)) {
                stone.buy = price;
            }
            //wood.inputBuy.value = "";
            //iron.inputBuy.value = "";
            //stone.buy = setZeroIfNaN(stone.buy);
            if (stone.buy === 0) {
                clearInterval(interval);
                console.log("stone:");
                console.log(stone);
                alert("This error message shouldn't pop up. Please open the console with CTRL+Shift+J and send a message to the developer via Discord, FunnyPocketBook#9373");
                return;
            }
            //stone.inputBuy.value = stone.buy;
            if (!isBuying) {
                buy("stone", stone.buy);
            }
        } else if ((iron.price >= price && iron.wh + iron.inc < topUp && document.querySelector("#ironCheck").checked) && iron.stock >= price) {
            // Buy iron
            iron.buy = topUp - iron.wh - iron.inc;
            if (iron.buy > iron.stock && iron.stock >= ((price * 10) + 10)) {
                iron.buy = (price * 10);
            } else if (iron.buy > iron.stock && iron.stock >= ((price * 9) + 10)) {
                iron.buy = (price * 9);
            } else if (iron.buy > iron.stock && iron.stock >= ((price * 8) + 10)) {
                iron.buy = (price * 8);
            } else if (iron.buy > iron.stock && iron.stock >= ((price * 7) + 10)) {
                iron.buy = (price * 7);
            } else if (iron.buy > iron.stock && iron.stock >= ((price * 6) + 10)) {
                iron.buy = (price * 6);
            } else if (iron.buy > iron.stock && iron.stock >= ((price * 5) + 10)) {
                iron.buy = (price * 5);
            } else if (iron.buy > iron.stock && iron.stock >= ((price * 4) + 10)) {
                iron.buy = (price * 4);
            } else if (iron.buy > iron.stock && iron.stock >= ((price * 3) + 10)) {
                iron.buy = (price * 3);
            } else if (iron.buy > iron.stock && iron.stock >= ((price * 2) + 10)) {
                iron.buy = (price * 2);
            } else if (iron.buy >= iron.stock && iron.stock >= (price)) {
                iron.buy = (price);
            }

            //wood.inputBuy.value = "";
            //stone.inputBuy.value = "";
            //iron.buy = setZeroIfNaN(iron.buy);
            if (iron.buy === 0) {
                clearInterval(interval);
                console.log("iron:");
                console.log(iron);
                alert("This error message shouldn't pop up. Please open the console with CTRL+Shift+J and send a message to the developer via Discord, FunnyPocketBook#9373");
                return;
            }
            //iron.inputBuy.value = iron.buy;
            if (!isBuying) {
                buy("iron", iron.buy);
            }
        }
    }
}

function buy(res, amnt) {
    isBuying = true;
    let data = {};
    data["buy_" + res] = amnt;
    data.h = game_data.csrf;
    TribalWars.post("market", { ajaxaction: "exchange_begin" }, data, function(r) {
        if (r[0].error) {
            isBuying = false;
            return;
        }
        let rate_hash = r[0].rate_hash;
        let buy_amnt = r[0].amount;
        data["rate_" + res] = rate_hash;
        data["buy_" + res] = buy_amnt;
        data["mb"] = 1;
        data.h = game_data.csrf;
        TribalWars._ah = {
            TribalWarsTE: 1,
        }
        TribalWars.post("market", { ajaxaction: "exchange_confirm" }, data, function(r) {
            isBuying = false;
            if (r.success) {
                UI.SuccessMessage("Comprou " + buy_amnt + " " + res + "!");
                console.log("Comprou " + buy_amnt + " " + res + "!");
                $("#market_status_bar").replaceWith(r.data.status_bar);
                getRes();
            }
        })
    })
}
/**
 * Update resource objects
 */
function getRes() {
    let parentInc;
    warehouse = game_data.village.storage_max;
    wood.wh = game_data.village.wood;
    stone.wh = game_data.village.stone;
    iron.wh = game_data.village.iron;
    wood.stock = parseInt(document.getElementById("premium_exchange_stock_wood").innerText);
    stone.stock = parseInt(document.getElementById("premium_exchange_stock_stone").innerText);
    iron.stock = parseInt(document.getElementById("premium_exchange_stock_iron").innerText);
    wood.price = parseInt(document.querySelector("#premium_exchange_rate_wood > div:nth-child(1)").innerText);
    stone.price = parseInt(document.querySelector("#premium_exchange_rate_stone > div:nth-child(1)").innerText);
    iron.price = parseInt(document.querySelector("#premium_exchange_rate_iron > div:nth-child(1)").innerText);
    try {
        if (document.querySelector("#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(1)").innerHTML.split(" ")[0].replace(":", "") === incoming) {
            parentInc = document.querySelector("#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(1)");
        }
    } catch (e) {}
    try {
        if (document.querySelector("#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(2)").innerHTML.split(" ")[0].replace(":", "") === incoming) {
            parentInc = document.querySelector("#market_status_bar > table:nth-child(2) > tbody > tr > th:nth-child(2)");
        }
    } catch (e) {}

    try {
        wood.inc = parseInt(setZeroIfNaN(parseInt(parentInc.querySelector(".wood").parentElement.innerText.replace(".", ""))));
    } catch (e) {}
    try {
        stone.inc = parseInt(setZeroIfNaN(parseInt(parentInc.querySelector(".icon header stone").parentElement.innerText.replace(".", ""))));
    } catch (e) {}
    try {
        iron.inc = parseInt(setZeroIfNaN(parseInt(parentInc.querySelector(".icon header iron").parentElement.innerText.replace(".", ""))));
    } catch (e) {}
}

function clickOnKeyPress(key, selector) {
    "use strict";
    if (event.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled
    }
    let handled = false;
    if (event.key === key) {
        document.querySelector(selector).click();
        handled = true;
    } else if (event.keyIdentifier === key) {
        document.querySelector(selector).click();
        handled = true;
    } else if (event.keyCode === key) {
        document.querySelector(selector).click();
        handled = true;
    }
    if (handled) {
        event.preventDefault();
    }
}

function setZeroIfNaN(x) {
    "use strict";
    if ((typeof x === 'number') && (x % 1 === 0)) {
        return x;
    } else {
        return 0;
    };
}