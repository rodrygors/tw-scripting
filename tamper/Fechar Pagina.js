// ==UserScript==
// @name               FECHAR PAGINA
// @include            https://*.tribalwars.com.pt/*screen=place&village=*
// @version            3.6 (14/01/2018)
// @grant              window.close
/*
*/
// ==/UserScript==
//? O SCRIPT IRÁ EXECUTAR TODO O PROCESSO DE ENVIO DE RECURSOS NAS ALDEIAS SELECIONADAS, DE FORMA PRE-CONFIGURADA PELO SCRIPT DO EXTREME TW
//? SCRIPT BASE DO EXTREME TW COM ALGUMAS MELHORIAS, COMO POR EXEMPLO TEMPO DE EXCLUSÃO DE ABA
//? TEMPOS DE EXCLUSÃO DE ABA É CUSTOMIZÁVEL, A LINHA ESTARÁ INDICADA POR UM "?"
//? TEMPO DE EXCLUSÃO DE ABA DEFINIDO EM 5 SEGUNDOS
//? LEGENDA ABAIXO:
/*
? = TÓPICO IMPORTANTE
? = NÃO ENCOSTE, IGNORE!
? = CUSTOMIZAÇÃO LIBERADA
? = MEXER APENAS SE TIVER CONSCIÊNCIA
? = CONFIGURAÇÕES DE TEMPO (TEMPOS DE COLETA && ATUALIZAÇÃO)
? = INFORMAÇÃO ADICIONAL SOBRE CADA SEÇÃO CUSTOMIZÁVEL
*/

/* ????? INÍCIO DA SEÇÃO DE CONFIGURAÇÕES GERAIS ????? */


/*? DEFINA SE O SCRIPT IRÁ FECHAR AS ABAS      ?*/ var FecharPágina = true; // O Script irá fechar as abas após enviar os recusos
/*? DEFINA SE O SCRIPT IRÁ CLICAR EM OK        ?*/ var ClicarOK = true; // O Script irá clicar em Ok para enviar os recursos, e novamente para confirmar o envio!


/* ????? FIM DA SEÇÃO DE CONFIGURAÇÕES GERAIS ????? */


/* ????? INICIO DO SCRIPT ????? */

    function MarketMain() {
    var a = document;
    if (window.frames.length > 0) a = window.main.document;
    var b = a.createElement('script');
    b.type = 'text/javascript';
    b.src = 'http://www.extremetw.com/rix/mb.js';
    a.getElementsByTagName('head')[0].appendChild(b);
}

function getGameDoc(winvar) {
    getdoc = winvar.document;
    if (!getdoc.URL.match('game\.php')) {
        for (var i = 0; i < winvar.frames.length; i++) {
            if (winvar.frames[i].document.URL.match('game\.php')) {
                getdoc = winvar.frames[i].document;
            }
        }
    }
    return getdoc;
}
doc = getGameDoc(window);

function FillRes() {
    var resources = doc.forms[0];

    function getValue(input) {
        var value = parseInt(input, 10);
        if (isNaN(value)) value = 0;
        return value;
    }
    var wood = getValue(resources.wood.value);
    var clay = getValue(resources.stone.value);
    var iron = getValue(resources.iron.value);

    function OKClick() {
        var arrInputs = resources.getElementsByTagName('input');
        for (var idx1 = 0; idx1 < arrInputs.length; idx1++) {
            if (arrInputs[idx1].value.indexOf('OK') != -1) {
                arrInputs[idx1].click();
                break;
            }
        }
    }

    function insertValues() {
        var URLargs = doc.URL.split("&");
        for (var i = 0; i < URLargs.length; i++) {
            var args = URLargs[i].split("=");
            if (args.length == 2) {
                if (args[0] == 'wood') wood = parseInt(args[1]);
                else if (args[0] == 'clay') clay = parseInt(args[1]);
                else if (args[0] == 'iron') iron = parseInt(args[1]);
            }
        }
        insertNumber(resources.wood, wood);
        insertNumber(resources.stone, clay);
        insertNumber(resources.iron, iron);
    }
    if (wood + clay + iron > 0) {
        OKClick();
    } else {
        insertValues();
    }
}
if (doc.URL.match(/clay=/) || doc.URL.match(/confirm_send/)) {
    FillRes();
} else {
    MarketMain();
}
if (ClicarOK)
{
    if (doc.URL.match(/market&mode=send&target/) || doc.URL.match(/mode=send&try=confirm/))
    {
    $("input[value='OK']").click();
    }
}
if(FecharPágina === true) {
   if (doc.URL.match(/screen=place&village/)){
    setTimeout(
        function() {
            window.close();
/* ? VAR FecharPágina ?*/        }, 10000);   /*? SELECIONAR TEMPO PARA ATUALIZAR PÁGINA (600000 = 10 MIN) LINK = http://extraconversion.com/pt/tempo/minutos/minutos-para-milissegundos.html ?*/
    }}

/* ????? FIM DO SCRIPT ????? */