// ==UserScript==
// @name         Cunhar Auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @include      https://*&screen=snob*
// @include      https://*/game.php?*screen=snob*
// @description  Cunhar automaticamente
// @author       Rodrygors
// ==/UserScript==

const alternarAldeia = 0;
const delayAlternarAldeia = 3600000; // 30000 =~ 30segundos
const safetyRefreshBuffer = 2000; // 2000 =~ 2 segundos / Define quanto tempo até dar refrash na página, caso falhe ao mudar a aldeia (Conexão à internet lenta em conjunto com um safetyRefreshBuffer baixo pode causar problemas a mudar de aldeia)
console.log('Tempo: ' + delayAlternarAldeia);

if ( alternarAldeia == 0 ) location.reload();
    else {
        $('.groupRight').click();
        $('.arrowRight').click();
        try {document.getElementsByClassName('jump_link')[0].click();}
        finally {
        setTimeout(function(){location.reload();}, safetyRefreshBuffer);
        }
    }

if ($('input[type="button"][value="My task"]') != 'none'){
    $('#coin_mint_fill_max').click();
    $('input.btn.btn-default').click();
	//console.log('Button clicked!');
    setInterval(refresh, delayAlternarAldeia);
}else{
    console.log('Button not clicked');
}