// ==UserScript==
// @name         Account Cretor
// @version      0.2
// @description  Cria contas fakes para o famoso mar de BBs
// @author       Victor GarÃ©
// @include https://*?ref=player_invite_linkrl*
// @include https://*/*new*
// @include https://*?welcome=1*
// @include https://*?screen=overview&intro*
// @require https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://raw.githubusercontent.com/victorgare/tribalwars/master/UserScript/AccountCreator.user.js
// @updateURL   https://github.com/victorgare/tribalwars/raw/master/UserScript/AccountCreator.user.js
// @run-at document-end
// ==/UserScript==

var url = "";
var mundo = "";

const caracteres = "abcdefghijklmnopqrstuvxzwy";
var nameLength = Math.floor(Math.random() * 10) + 5;
const criarContaSemReferal = "new";
const criarContaComReferal = "?ref=player_invite_linkrl"
const escolherMundo = "?welcome=1";
const logado = "?screen=overview&intro";
const emailDomainList = ['google', 'sapo', 'live', 'hotmail'];

$(window).load(function () {
    var urlAtual = window.location.href;

    if (urlAtual.indexOf(criarContaSemReferal) !== -1 || urlAtual.indexOf(criarContaComReferal)) {
        console.log("criou a conta");
        CriarConta();

    }

    if (urlAtual.indexOf(escolherMundo) !== -1) {
        console.log("escolheu o mundo");
        AcessarMundo();
    }

    if (urlAtual.indexOf(logado) !== -1) {
        console.log("voltou pro inicio");
        window.location.href = url;
    }
});

//primeiro passo, preencher o form para criar a conta
function CriarConta() {
    var name = "";

    for (let i = 0; i < nameLength; i++) {
        let randomNumber = Math.floor(Math.random() * 25);
        name += caracteres[randomNumber];
    }

    const randIndex = Math.floor(Math.random() * (emailDomainList.length - 1));

    $("#register_username").val(name);
    $("#register_password").val(name + "1234");
    $("#register_email").val(name + "@" + emailDomainList[randIndex] + ".com");
    $("#terms").prop("checked", true);

    $(".btn-register").on("click", function (e) {
        e.preventDefault();

        $(":submit").click();
    });

    setTimeout(function(){
        $(".btn-register").trigger("click");
    }, 500);

}

//acessa o mundo
function AcessarMundo() {
    $("a").each(function () {
        if (this.href.endsWith(mundo)) {
            window.location.href = this.href;
        }
    });
}