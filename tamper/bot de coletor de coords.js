// ==UserScript==
// @name           BOOT COLETOR COORDENADAS MAPA
// @author         Marcos V.S. Marques
// @email          tribalwarsbr100@gmail.com
// @namespace      https://www.youtube.com/channel/UCIngQdlpQxocFDB4Vk6yERg
// @version        2.1 (JUN/2017)
// @grant          Publico
// @description    SCRIPT BOOT TW 100 COLETOR COORDENADAS MAPA  (linguagem: javascript-ECMAscript5;)
// @Realiza        CALCULO DE SNIPAGEM E BACK TIME
// @Op��es         COLETAGEM DE COORDENADAS EM LISTA, EM CODIGO BB, EM SEQUENCIA NUMERICA
// @Utiliza��o     NO MAPA DO TW
// @include        http*://*.die-staemme.de/*
// @include        http*://*.staemme.ch/*
// @include        http*://*.tribalwars.net/*
// @include        http*://*.tribalwars.nl/*
// @include        http*://*.plemiona.pl/*
// @include        http*://*.tribalwars.se/*
// @include        http*://*.tribos.com.pt/*
// @include        http*://*.divokekmeny.cz/*
// @include        http*://*.bujokjeonjaeng.org/*
// @include        http*://*.triburile.ro/*
// @include        http*://*.voyna-plemyon.ru/*
// @include        http*://*.fyletikesmaxes.gr/*
// @include        http*://*.tribalwars.no.com/*
// @include        http*://*.divoke-kmene.sk/*
// @include        http*://*.klanhaboru.hu/*
// @include        http*://*.tribalwars.dk/*
// @include        http*://*.plemena.net/*
// @include        http*://*.tribals.it/*
// @include        http*://*.klanlar.org/*
// @include        http*://*.guerretribale.fr/*
// @include        http*://*.guerrastribales.es/*
// @include        http*://*.tribalwars.fi/*
// @include        http*://*.tribalwars.ae/*
// @include        http*://*.tribalwars.co.uk/*
// @include        http*://*.vojnaplemen.si/*
// @include        http*://*.genciukarai.lt/*
// @include        http*://*.wartribes.co.il/*
// @include        http*://*.plemena.com.hr/*
// @include        http*://*.perangkaum.net/*
// @include        http*://*.tribalwars.jp/*
// @include        http*://*.tribalwars.bg/*
// @include        http*://*.tribalwars.asia/*
// @include        http*://*.tribalwars.us/*
// @include        http*://*.tribalwarsmasters.net/*
// @include        http*://*.tribalwars.com.br/*
// @include        http*://*.tribalwars.com.pt/*
// @icon           https://media.innogamescdn.com/com_DS_FR/Quickbar/priest.png
// ==/UserScript==

/* Changelog vers�o 2
*        Equipe do Canal Youtube TW 100 se reserva ao direito de possuir a posse do codigo-fonte  do script, quaisquer modifica��o deve ser solicitado via email, segundos regras da Licen�a P�blica Geral GNU
*        Equipe do Canal Youtube TW 100 n�o se responsabiliza por eventuais danos causados pela utiliza��o do script
        Equipe do Canal Youtube TW 100 promove a canpanha "Software livre n�o e virus nem boot" abra�a e se solidariza com os scripts de tampermonkey voltados para o game tribal wars, do qual as equipes inesperientes de suporte, sem conhecimento, e sem saber a historia dos primordios do game, imp�e um pensamento de que os script de tampermonkey s�o proibidos. Muitas das melhorias no game, que se deu atraves de scrips de tampermonkey, feitos de players para players, Alem do qual esse pensamento foi uma forma da da grande empresa tutora do game promover seus ganhos com recursos pagos, e assim prejudicando os jogadores que n�o utiliza de dinheiro para jogar, EQUIPE TW 100 DEIXA CLARO, QUE N�O E PRECISO TER FUN��ES PAGAS PARA USUFLUIR DO GAME, TEMOS A MISS�O DE TRAZER UMA INGUALA��O DO QUAL OS PLAYERS QUE N�O USUFLEM DE RECURSOS PREMIUNS TENHA A SUA DIPONIBILIDADE OS MESMO RECURSOS DOS QUE TEM*/javascript:$.getScript('https://dl.dropbox.com/s/kcwhv6koktp4kf5/COLETOR%20BOOT%20%5BTW100%5D.js?');void(0);
/*   Equipe do Canal Youtube TW 100 no dia 25/06/2017 v2.0i primeira vers�o para atualiza��o TW 8.89
*        Equipe do Canal Youtube TW 100 Script em desenvolvimento, ao longo do tempo, de acordo com o tempo disponivel iremos adicionar mais fun��es
*/


/*TW100*/ /* LOGO IREMOS CRIAR NOSSA PLAYLIST NO YOUTUBE SOMENTE COM SCRIPT TAMPERMONKEY*/

/* SettingsAPI: CANAL DO YOUTUBE TW 100
  -------------------------------------------------------------------------------------
  +---++---++-+-+++---+++---     +---++---+     ++--+++---+++-+++----+++-+++--+-+---+     +----+------     -++-+---++---+
�+-+��+-+���++���+-+���---     ++++��+-+�     �++++��+-+���-���++++���-���++�-�+--+     �++++�------     ++�-�+-+��+-+�
��-++��-���++++���-����---     -������-��     ++++++��-����-��++��++��-���++++�+--+     ++��++++++++     ++�-����������
��-++�+-+���++���+-+���-++     -������-��     -++++-��-����-��--��--��-���+-+��+--+     --��--�++++�     -��-����������
�+-+��+-+���-����+-+��+-+�     ++++��+-+�     --��--�+-+��+-+�--��--�+-+��+-+��+--+     --��--++++++     ++++�+-+��+-+�
+---+++-++++-+-+++-+++---+     +---++---+     --++--+---++---+--++--+---++---++---+     --++---++++-     +--++---++---+
+----+------     -++-+---++---+
�++++�------     ++�-�+-+��+-+�
++��++++++++     ++�-����������
--��--�++++�     -��-����������
--��--++++++     ++++�+-+��+-+�
--++---++++-     +--++---++---+
���?������� ]____________?
?_?���������?_??
I�������������������].
???????????????...
*/