// ==UserScript==
// @name         Renomeador de Ataques II
// @author       Francisco pato
// @include      https://*overview_villages&mode=incomings*
// ==/UserScript==

setTimeout(function () { location.reload(1); }, 10000);
{
 $('input#select_all.selectAll').click();
    setTimeout(function(){
 var label = document.getElementsByName("label");
    label[0].click();
    }, 10000);
}