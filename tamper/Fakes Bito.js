// ==UserScript==
// @name Fakes Bito V4
// @include https://pt88*
// @grant none
// ==/UserScript==


var x = 0;

//***************************************************************//
//                          User Input                           //
//***************************************************************//

// Colocar aqui tempo entre ataques (em milisegundos)
var tempo = 30000;

// Meter 1 pra enviar fakes, 0 para enviar todas as tropas
var fake = 1;

// Meter aqui numero maximo de fakes a chegar a cada aldeia inimiga
var FakesPorAldeia = 1;

// Meter aqui numero de unidades a enviar em cada ataque quando opção fake está ativa (a 1)
var sp = 0;
var sw = 0;
var ax = 0;
var scout = 0;
var lc = 4;
var hv = 0;
var cat = 0;
var ra = 0;

// Meter aqui o numero maximo de fakes a sair da aldeia atual
var maxFakesAldeia = 1;

// Meter aqui as coordenadas onde enviar fakes
var coords = '596|536 595|537 595|534 596|533 594|532 593|533 593|532 591|534 590|535 589|535 590|531 590|530 591|530 592|528 591|527 592|527 593|528 594|529 598|532 599|5295 99|525 598|525 601|526 601|527 603|528 603|529 604|527 603|525 599|534 603|532 604|534 605|531 606|534 608|533 607|529 608|528 608|525 606|536 609|536 605|541 608|540 604|541 602|541 602|540 603|539 600|537 598|538 598|537 597|539 599|538 601|537 597|540 597|541 597|542 596|542 596|540 595|541  592|539  591|539 590|539 590|540 590|541 590|538 591|537 587|537 587|540 585|538 585|535 584|533 583|532 583|531 585|531 583|536 582|540 588|541 585|541 585|543 586|544 588|544 591|542 592|544 592|545 593|545 594|545 595|546 598|544 601|543 602|543 601|544 603|535 610|533 610|529 611|524 612|524 614|524 613|528 613|532 613|533 613|535 612|537 611|542 611|541 612|540 614|536 615|533 616|533 616|534 616|535 616|536 600|523 600|522 599|522 598|523 598|521 597|520 597|519 601|519 603|518 603|516 603|520 606|517 609|518 609|522 607|523 611|521 613|518 601|517 600|517 594|521 594|518 594|517 592|520 590|521 590|523 590|525 590|526 587|523 587|520 586|520 586|523 589|523 585|519 587|516 589|515 590|514 592|514 590|519 591|517 591|518 592|517 585|526 583|528 583|524 582|524 581|522 580|523 579|525 579|526 580|527 580|529 581|530 581|533 579|533 578|532 576|532 576|530 575|531 574|532 574|531 573|531 572|531 574|529 572|529 572|528 572|526 573|525 574|522 577|522 579|522 579|521 580|518 582|518 583|518 582|517 593|515 598|512 600|512 601|513 604|514 607|511 607|512 609|510 609|512 608|515 607|514 610|515 580|543 582|544 580|542 583|544 582|546 581|546 581|545 580|546 580|545 581|548 581|549 586|547 587|545 590|548 591|550 590|550 589|552 576|540 576|539 576|538 574|538 572|539 571|540 571|541 575|535 578|540 579|540 580|540 581|539';

//***************************************************************//
//***************************************************************//

var doc = document;
var url = document.URL;
var cookieName = "farmeruk";
var cookieNameTent = "tentcookie";
var maxTentativas = 1;
var data;
var h2 = document.getElementsByTagName('h2');
var Praca = false;
var EnviarAtaque = false;

for (i = 0; i < h2.length; i++)
{
    if (h2[i].innerHTML == "Praça de Reuniões (nível 1)")
    {
        Praca = true;
    }
    else if(h2[i].innerHTML.search("Confirmar ataque a") != -1)
    {
        EnviarAtaque=true;
    }
}

if (Praca == EnviarAtaque)
    var tentCookie = document.cookie.match('(^|;) ?' + cookieNameTent + '=([^;]*)(;|$)');

if (tentCookie != null)
{
    var numTentativas = parseInt(tentCookie[2]);
}
else
{
    data = new Date(2050, 11, 11);
    document.cookie = cookieNameTent + "=0;expires=" + data.toGMTString();
    var numTentativas = 0;
}

if (Praca)
{
    if (document.getElementsByClassName("error_box")[0] != undefined)
    {
        var erroFaltaUnid = document.getElementsByClassName("error_box");
        for (i = 0; i < erroFaltaUnid.length && !found; i++)
        {
            if (erroFaltaUnid[i].innerHTML.search("Não existem unidades suficientes") != -1)
            {
                altAldeia();
                throw '';
            }/*else if (erroFaltaUnid[i].innerHTML.search("Até 16.5. 18:41, apenas pode atacar e ser atacado se a diferença entre os seus pontos e os do inimigo for no máximo 20 : 1.") != -1){
                 index = index + 1;
                 cookie_date = new Date(2020, 11, 11);
                 document.cookie = cookieName + "=" + index + ";expires=" + cookie_date.toGMTString();
                 window.location.reload();
            }else if (document.getElementsByClassName("error_box")[0].innerText.equals("Este jogador foi bloqueado e, por isso, não pode ser atacado nem apoiado.")){
                 index = index + 1;
                 cookie_date = new Date(2020, 11, 11);
                 document.cookie = cookieName + "=" + index + ";expires=" + cookie_date.toGMTString();
                 window.location.reload();
            }
            else{
                altAldeia();
                throw '';}*/


        }

    }

    if (doc.forms[0].x.value != "")
    {
        var index = 0;
        var fakesAldeia = 0;
        farmcookie = document.cookie.match('(^|;) ?' + cookieName + '=([^;]*)(;|$)');

        if (farmcookie != null)
        {
            index = parseInt(farmcookie[2].split("-")[0]);
            fakesAldeia = parseInt(farmcookie[2].split("-")[1]);
        }


        if( fakesAldeia>=maxFakesAldeia){
            fakesAldeia = 0;
            cookie_date = new Date(2050, 11, 11);
            document.cookie = cookieName + "=" + index + "-" + fakesAldeia + ";expires=" + cookie_date.toGMTString();
            altAldeia();

        }
        setTimeout(function() {
            if (index >= coords.length)
            {
                index = 0;
            }

            index = index + 1;
            fakesAldeia = fakesAldeia + 1;
            cookie_date = new Date(2050, 11, 11);
            document.cookie = cookieName + "=" + index + "-" + fakesAldeia + ";expires=" + cookie_date.toGMTString();
            var link = document.getElementsByClassName("quickbar_link");

            for (i = 0; i < link.length; i++)
            {
                if (link[i].href.search(/screen=place/) != -1)
                {
                    window.location.href = link[i].href;
                }
            }
         }, 1000);
    }

    else
    {
        if (window.frames.length > 0)
        {
            doc = window.main.document;
        }

        url = document.URL;
        coords = coords.split(" ");
        var index = 0;
        var fakesAldeia = 0;
        farmcookie = document.cookie.match('(^|;) ?' + cookieName + '=([^;]*)(;|$)');
        if (farmcookie != null)
        {
            index = parseInt(farmcookie[2].split("-")[0]);
            fakesAldeia = parseInt(farmcookie[2].split("-")[1]);
        }
        console.log(fakesAldeia);
        if( fakesAldeia >= maxFakesAldeia){
            cookie_date = new Date(2050, 11, 11);
            fakesAldeia = 0;
            document.cookie = cookieName + "=" + index + "-" + 0 + ";expires=" + cookie_date.toGMTString();
            altAldeia();

        }
        setTimeout(function() {
            if (index >= coords.length)
            {
                index = 0;
            }

            if (document.getElementsByClassName("command-list-count") [0] != undefined)
            {
                var numAtaques = document.getElementsByClassName("command-list-count") [0].innerHTML;
            }
            else
            {
                var numAtaques = 0;
            }

            if (numAtaques < FakesPorAldeia)
            {
                if (numTentativas <= maxTentativas)
                {
                    coords = coords[index];
                    coords = coords.split("|");
                    index = index + 1;
                    fakesAldeia = fakesAldeia + 1;
                    cookie_date = new Date(2050, 11, 11);
                    document.cookie = cookieName + "=" + index + "-" + fakesAldeia + ";expires=" + cookie_date.toGMTString();
                    doc.forms[0].x.value = coords[0];
                    doc.forms[0].y.value = coords[1];
                    doc.forms[0].spy.value = scout;
                    doc.forms[0].spear.value = sp;
                    doc.forms[0].sword.value = sw;
                    doc.forms[0].axe.value = ax;
                    doc.forms[0].spy.value = scout;
                    doc.forms[0].light.value = lc;
                    doc.forms[0].heavy.value = hv;
                    doc.forms[0].ram.value = ra;
                    doc.forms[0].catapult.value = cat;
		    if (fake == 0) {
                    document.getElementById("selectAllUnits").click();
                    }


                    document.forms[0].attack.click();
                }
                else
                {
                    data = new Date(2050, 11, 11);
                    document.cookie = cookieName + "=" + index + ";expires=" + cookie_date.toGMTString();
                    altAldeia();
                }

            }
            else
        {
           altAldeia();
        }
        }, 2000);


    }
}

else if (EnviarAtaque)
{
    var BNCheck = document.getElementsByClassName("error");
    var found = false;

    for (i = 0; i < BNCheck.length && !found; i++)
    {
        if (BNCheck[i].innerHTML == "Bónus noturno ativo!")
        {
            found = true;
            console.log("BN")
        }
    }
    if (found)
    {
        var link = document.getElementsByClassName("quickbar_link");

        for (i = 0; i < link.length; i++)
        {
            if (link[i].href.search(/screen=place/) != -1)
            {
                numTentativas = numTentativas + 1; data = new Date(2050, 11, 11);
                document.cookie = cookieNameTent + "=" + numTentativas + ";expires=" + data.toGMTString();
                window.location.href = link[i].href;
            }
        }

    }
    /*else if($(".relative_time").text().includes("amanhã") == false ){
        document.getElementById("village_switch_right").click();

    }*/
    else
    {
        setTimeout(function() {
            document.forms[0].troop_confirm_submit.click();
            }, 4000);
    }


}
function altAldeia() {
    $('.arrowRight').click();
       $('.groupRight').click();
       $('div.arrow.arrowRight').click();
       $('div.arrow.groupRight').click();

if($('.groupRight').length<1 && $('.arrowRight').length<1)
    window.location.reload();
}