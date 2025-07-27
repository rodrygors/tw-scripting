// ==UserScript==
// @name         Renomear Ataques (Cores v2.0) edited by Injured
// @version      Release
// @include      **&screen=overview
// @include      **&mode=incomings*
// @include      **&screen=info_village&*
// @include      **&screen=place*
// @include      **?screen=place&t=*&village=*
// @include      **?screen=place&village=*
// @include      **?screen=overview&village=*
// @include      **?village=*&screen=overview*
// @include      **?t=*&village=*&screen=overview*
// ==/UserScript==

////* Preferêcias do script *////
// O tamanho da letra influencia o tamanho do botao, caso seja 0 será utilizado o original do jogo, 12.
var tamanho_letra = 8;
var pagina_de_ataques = 'coluna'; //Modos: coluna, linha, nada

// Para adicionar botões basta colocar os valores depois de uma virgula, o botÃ£o so aparece caso haja valor de nome de botÃ£o e nome de comando.
// Caso nÃ£o coloque a cor do botao ou cor do texto serÃ¡ utilizado o valor original do jogo (botao castanho e letra branca)
var settings = [
    ['[Morto]', '[Apoiar]', '[Desviado]', '[Desviar]', '[Reconquistar]', '[Reconquistado]', '[Reconquista]', '[Snipado]', '[Snipar]', ' [Antes do Snipe]', ' | Vigiar', ' |Possível Fake', '[Fake]'], //Nome do comando
    ['M', 'A', 'D!', 'D', 'R', 'R!', 'RR', 'S!', 'S', 'AS', 'V!' , 'PF', 'F'], //Nome do botÃ£o
    ['green', 'lime', 'orange', 'dorange', 'gray', 'white', 'yellow', 'lblue', 'blue', 'black', 'yellow', 'pink', 'purple'], //Cor do botÃ£o
    ['white', 'white', 'white', 'white', 'white', 'black', 'black', 'white', 'white', 'white', 'black', 'black', 'white']
] //Cor do texto

// Para adicionar cores basta acrescentar os valores apÃ³s uma virgula.
var colors = [
    ['red', 'green', 'blue', 'yellow', 'orange', 'lblue', 'lime', 'white', 'black', 'gray', 'dorange', 'pink', 'purple'], // Nomes das cores
    ['#e20606', '#31c908', '#0d83dd', '#ffd91c', '#ef8b10', '#22e5db', '#ffd400', '#ffffff', '#000000', '#adb6c6', '#ff0000', '#D433FF', '#4233FF'], // Cor de background de botÃ£o topo e letra
    ['#836FFF', '#228c05', '#0860a3', '#e8c30d', '#d3790a', '#0cd3c9', '#ffd400', '#dbdbdb', '#2b2b2b', '#828891', '#ff0000', '#D433FF', '#4233FF']
] // Cor de background de botÃ£o fundo


////* CÃ³digo do programa *////

var world = String(location.href).split(/[/:.]+/)[1]
var world_number = Number(world.substring(2))

function iT(nr, linha) {
    var html = '';
    if (settings[0]) html += '<span style="float: right;">';
    settings[1].forEach(function(nome, num) {
        html += '<button type="button" id="opt' + nr + '_' + num + '" class="btn" title="' + settings[0][num] + '" style="color: ' + getFon(num) + '; font-size: ' + getSize() + 'px !important; background: linear-gradient(to bottom, ' + getTop(num) + ' 30%, ' + getBot(num) + ' 10%)">' + nome + '</button>';
    })
    html += '</span>';
    $(linha).find('.quickedit-content').append(html);
    settings[0].forEach(function(nome, num) {
        if (nome.indexOf('|') == -1) {
            $('#opt' + nr + '_' + num).click(function() {
                $(linha).find('.rename-icon').click();
                $(linha).find('input[type=text]').val($(linha).find('input[type=text]').val().split(" ")[0] + ' ' + settings[0][num]);
                $(linha).find('input[type=button]').click();
                iT(nr, linha);
            });
        } else if (nome.indexOf('|')) {
            $('#opt' + nr + '_' + num).click(function() {
                $(linha).find('.rename-icon').click();
                $(linha).find('input[type=text]').val($(linha).find('input[type=text]').val() + settings[0][num]);
                $(linha).find('input[type=button]').click();
                iT(nr, linha);
            });
        }
    });
}

function getTop(num) {
    var index = colors[0].indexOf(settings[2][num])
    if (settings[2][num]) {
        return colors[1][index];
    } else {
        return '#b69471';
    }
}

function getBot(num) {
    var index = colors[0].indexOf(settings[2][num])
    if (settings[2][num]) return colors[2][index];
    else return '#6c4d2d';
}

function getFon(num) {
    var index = colors[0].indexOf(settings[3][num])
    if (settings[3][num]) return colors[1][index];
    else return '#ffffff';
}


function getSize() {
    if (tamanho_letra) return tamanho_letra;
    else return 12;
}

if (location.href.indexOf("screen=overview_villages") == -1 && location.href.indexOf("mode=incomings&subtype=attacks") == -1) {
    $('#commands_incomings .command-row').each(function(nr, linha) {
        if (!isSupport(linha)) iT(nr, linha, true);
    });
} else {
    setInterval(function() {
        $('#incomings_table tr.nowrap').each(function(nr, linha) {
            if (!isSupport(linha)) {
                var name = $.trim($(linha).find('.quickedit-label').text())
                var code = settings[0].indexOf(name.indexOf(" ") >= 0 ? name.substr(name.indexOf(" ") + 1) : name)
                var dual = check(name)
                var codes = []
                codes[0] = check(name, 1);
                codes[1] = check(name, 2);
                if (code != -1) {
                    var colorcode = settings[2][code]
                    var color = colors[1][colors[0].indexOf(colorcode)]
                    if (pagina_de_ataques === 'linha') {
                        $(linha).find('td').each(function(nr, td) {
                            $(td).attr('style', 'background: ' + color + ' !important;')
                        })
                    } else if (pagina_de_ataques === 'coluna') {
                        $(linha).find('td:eq(0)').attr('style', 'background: ' + color + ' !important;')
                        $(linha).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                    }
                } else if (dual) {
                    console.log(codes, nr)
                    var colorcode1 = settings[2][codes[0]]
                    var colorcode2 = settings[2][codes[1]]
                    var color1 = colors[1][colors[0].indexOf(colorcode1)]
                    var color2 = colors[1][colors[0].indexOf(colorcode2)]
                    var textcolor = colors[1][colors[0].indexOf('white')]
                    var strokecolor = colors[1][colors[0].indexOf('black')]
                    if (pagina_de_ataques === 'linha') {
                        $(linha).find('td').each(function(nr, td) {
                            $(td).attr('style', 'background: repeating-linear-gradient(45deg, ' + color1 + ', ' + color1 + ' 10px, ' + color2 + ' 10px, ' + color2 + ' 20px) !important;')
                        })
                    } else if (pagina_de_ataques === 'coluna') {
                        $(linha).find('td:eq(0)').attr('style', 'background: repeating-linear-gradient(45deg, ' + color1 + ', ' + color1 + ' 10px, ' + color2 + ' 10px, ' + color2 + ' 20px) !important;')
                        $(linha).find('a:eq(0)').attr('style', 'color: ' + textcolor + ' !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                    }
                } else {
                    if (pagina_de_ataques === 'linha') {
                        $(linha).find('td').each(function(nr, td) {
                            $(td).attr('style', 'background: ' + colors[2][colors[0].indexOf('red')] + ' !important;')
                        })
                        $(linha).find('a').each(function(nr, td) {
                            $(td).attr('style', 'color: ' + colors[2][colors[0].indexOf('white')] + ' !important;')
                        })
                    } else if (pagina_de_ataques === 'coluna') {
                        $(linha).find('td:eq(0)').attr('style', 'background: ' + colors[2][colors[0].indexOf('red')] + ' !important;')
                        $(linha).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                    }
                }
            } else {
                if (pagina_de_ataques === 'linha') {
                    $(linha).find('td').each(function(nr, td) {
                        $(td).attr('style', 'background: ' + colors[2][colors[0].indexOf('yellow')] + ' !important;')
                    })
                    $(linha).find('a').each(function(nr, td) {
                        $(td).attr('style', 'color: ' + colors[2][colors[0].indexOf('white')] + ' !important;')
                    })
                } else if (pagina_de_ataques === 'coluna') {
                    $(linha).find('td:eq(0)').attr('style', 'background: ' + colors[2][colors[0].indexOf('yellow')] + ' !important;')
                    $(linha).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                }
            }
        })
    }, 250)
}

function check(name, nr) {
    var i, j;
    for (i = 0; i < settings[0].length; i++) {
        for (j = 0; j < settings[0].length; j++) {
            if (name.indexOf(settings[0][i] + settings[0][j]) != -1) {
                if (nr == 1) return i;
                else if (nr == 2) return j;
                else return true;
            }
        }
    }
    return false;
}

function isSupport(linha) {
    var scr = $(linha).find('img:eq(0)').attr('src')
    if (scr.indexOf('support') >= 0) return true;
    return false;
}
