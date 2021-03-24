var json_monsters = false;
$.getJSON("./api/monsters.json", function(data) {
    json_monsters = data;
});
$(document).on('click', '.monster>h2', function(event){
    $(this).siblings('p,table,ul,.img,ol,blockquote').toggle();
});
$(document).on('click', '.monster>.img', function (event) {
    img = this;
    style = img.currentStyle || window.getComputedStyle(img, false);
    bi = style.backgroundImage.slice(5, -2);

    var win = window.open(bi, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Please allow popups for this website');
    }

});
$(document).on('click', '.monster .cross', function (event) {
    $(this).parent('.monster').remove();
});

$(document).on('click', '.popup .cross,.right>.cross', function (event) {
    if (!$(this).hasClass('random'))
        $('.popup').toggle();
});

$(document).on('click', '.right>.random.cross', function (event) {
    $('.left').toggle();
});
$(document).on('keyup', 'input.searcher', function () {
    var val = ($(this).val()).toLowerCase();
    var $monsters = $('.popup .post-list li');

    $monsters.each(function () {
        if ($(this).attr('data-jets').indexOf(val) != -1)
            $(this).show();
        else
            $(this).hide();
    })

    $('.popup .post-list').each(function()
    {
        $(this).parent().show();
        if($(this).children(':visible').length == 0)
            $(this).parent().hide();
            
    })
})

$(document).on('click', '.encounter,.post-link', function (event) {
    event.preventDefault();
    if ($(this).hasClass('encounter'))
        $("#resultmonster").empty();
    $('.encounter').removeClass('selected');
    $(this).addClass('selected');
    var monsters = ($(this).html()).split(";")[0];
    monsters = monsters.split(' and ');
    $.each(monsters, function (i, item) {
        monsters[i] = monsters[i].replace(/\([\s\S]*\)/g, "")
        monsters[i] = monsters[i].replace(/\d[\s\S]+x /g, "");
        monsters[i] = monsters[i].replace(/<span>[\s\S]+<\/span>/g, "");
        monsters[i] = monsters[i].replace("<span>", "");
        monsters[i] = monsters[i].trim();
        monsters[i] = monsters[i].replace(/ /g, "-");
    });

    get_monsters_no_api(monsters);

})
function get_monsters_no_api(monsters) {
    var date = '2017-09-10';
    $(monsters).each(function () {
        var monster = this;
        monster = monster.toLowerCase();
        $.ajax({
            url: "./posts/" + date + "-" + monster + ".markdown",
            type: 'GET',
            dataType: "text",
            success: function (data) {
                var converter = new showdown.Converter();
                converter.setOption('tables', true);
                data = converter.makeHtml(data);
                data = data.replace(/layout: post/g, "");
                data = data.replace(/title/g, "");
                data = data.replace(/:/g, "");
                data = data.replace("date", "");
                data = data.replace(date, "");
                data = data.replace(/tags/g, "<br>");

                var search = monster + ' dnd';
                search = search.replace(/ /g, "+");
                var idimg = (search.replace(/\+/g, "")).replace(/-/g, "");
                $("#resultmonster").append("<div class='monster " + idimg + "'><div class='initiative'></div><div class='cross'>X</div>" + data + "<div class='img'></div></div>");
                var d20 = parseInt((Math.random() * 20) + 1);
                var dex = $("." + idimg + " table tbody td").eq(1).text();
                dex = dex.substring(dex.lastIndexOf("(") + 1, dex.lastIndexOf(")"));
                var init = Number(d20) + Number(dex);
                if(init <= 0)
                    init = 1;
                $("." + idimg + " .initiative").text(init);
                $("." + idimg + " h2").html($("." + idimg + " p").eq(0).text() + $("." + idimg + " h2").html());
                $("." + idimg + " p").eq(0).remove();
                var urlsearch = 'https://www.googleapis.com/customsearch/v1?searchType=image&q=' + search + '&key=AIzaSyBx6r6YMITZtWB2AR_WuLBr14UU4D7p--s&cx=006721926462795274470%3A9i78bwvk0ry';
                $("." + idimg + " .img").addClass('hideimportant');
                $.ajax({
                    url: urlsearch,
                    type: 'GET',
                    dataType: "json",
                    success: function (data2) {
                        var image = data2['items']['0']['link'];
                        $("." + idimg + " .img").attr('style', 'background-image:url("' + data2['items']['0']['link'] + '")');
                        $("." + idimg + " .img").removeClass('hideimportant');
                    }
                });

            }
        })
    })

}
function get_items() {
    var n_pc = $('#encounter-n_pc').val();
    var level = $('#encounter-level').val();
    var difficulty = $('#encounter-difficulty').val();
    var environment = $('#encounter-environment').val();

    var threshold_easy = getThresholdByLevelAndDifficulty(level, 'easy', n_pc);
    var threshold_medium = getThresholdByLevelAndDifficulty(level, 'medium', n_pc);
    var threshold_hard = getThresholdByLevelAndDifficulty(level, 'hard', n_pc);
    var threshold_deadly = getThresholdByLevelAndDifficulty(level, 'deadly', n_pc);

    var target = json_monsters[environment];
    var $res = $('#resultencounter');
    $res.html(' ');
    for(var i= 0;i<10;i++)
    {
        var enc = doEncounter(threshold_easy, threshold_deadly, target);
        var html = "<p class='encounter'><span>"+(Number(i)+1)+" - </span>";
        var x =0;

        for(var k in enc[0])
        {
            var len = Object.keys(enc[0]).length;
            for(var z in enc[0][k])
                html += enc[0][k][z];
            if(Number(x)+1 != len)
                html += ' and ';

            x++;
        }
        html += "; "+enc[1]+" xp"+"</p>";
        $res.append(html);
    }



}
function doEncounter(min, max, target) {
    var totalExp = 0;
    var calculatedExp = 0;
    var result = {};
    var salir = false;
    var len = 0;

    while ((calculatedExp < min || calculatedExp <= max) && salir == false) {
        var properties = Object.getOwnPropertyNames(target);
        var index = Math.floor(Math.random() * properties.length);
        var output = {};
        output[properties[index]] = target[properties[index]];

        var exp = Number(Object.keys(output));

        if (exp >= min*0.25) {
            if (getCalculatedExp(len + 1, exp + totalExp) <= max) {
                output = output[exp];
                properties = Object.getOwnPropertyNames(output);
                index = Math.floor(Math.random() * properties.length);
                output = {};
                output[properties[index]] = output[properties[index]];

                totalExp = totalExp + exp;
                var qty = 1;
                var monster = Object.keys(output);
                var finalMonster = qty+" x " + monster;

                len++;
                calculatedExp = getCalculatedExp(len, totalExp);

                while(getCalculatedExp(len + 1, exp + totalExp) <= max && Math.random() < 0.5) {
                    len++;
                    qty++;
                    totalExp = totalExp + exp;

                    calculatedExp = getCalculatedExp(len, totalExp);
                    finalMonster = qty+" x "+monster;
                }
                //TODO: Si el monster ya existe en el array, no hacer push sino hacer un +1 a la qty (1er character de la string)
                result[monster] = finalMonster;

            } else if (calculatedExp >= min && Math.random() < 0.2) {
                salir = true;
            }
        }
    }

    return [result, calculatedExp];

}

function getCalculatedExp(len, calculatedExp) {
    if (len > 1) {
        if (len < 3) {
            calculatedExp = calculatedExp * 1.5;
        } else if (len < 7) {
            calculatedExp = calculatedExp * 2;
        } else if (len < 11) {
            calculatedExp = calculatedExp * 2.5;
        } else if (len < 15) {
            calculatedExp = calculatedExp * 3;
        } else {
            calculatedExp = calculatedExp * 4;
        }
    }
    return calculatedExp;
}
function getThresholdByLevelAndDifficulty(level, difficulty, quantity) {

    var table = {
        'easy': {
            1: 25,
            2: 50,
            3: 75,
            4: 125,
            5: 250,
            6: 300,
            7: 350,
            8: 450,
            9: 550,
            10: 600,
            11: 800,
            12: 1000,
            13: 1100,
            14: 1250,
            15: 1400,
            16: 1600,
            17: 2000,
            18: 2100,
            19: 2400,
            20: 2800
        },
        'medium': {
            1: 50,
            2: 100,
            3: 150,
            4: 250,
            5: 500,
            6: 600,
            7: 750,
            8: 900,
            9: 1100,
            10: 1200,
            11: 1600,
            12: 2000,
            13: 2200,
            14: 2500,
            15: 2800,
            16: 3200,
            17: 3900,
            18: 4200,
            19: 4900,
            20: 5700
        },
        'hard': {
            1: 75,
            2: 150,
            3: 225,
            4: 375,
            5: 750,
            6: 900,
            7: 1100,
            8: 1400,
            9: 1600,
            10: 1900,
            11: 2400,
            12: 3000,
            13: 3400,
            14: 3800,
            15: 4300,
            16: 4800,
            17: 5900,
            18: 6300,
            19: 7300,
            20: 8500
        },
        'deadly': {
            1: 100,
            2: 200,
            3: 400,
            4: 500,
            5: 1100,
            6: 1400,
            7: 1700,
            8: 2100,
            9: 2400,
            10: 2800,
            11: 3600,
            12: 4500,
            13: 5100,
            14: 5700,
            15: 6400,
            16: 7200,
            17: 8800,
            18: 9500,
            19: 10900,
            20: 12700
        }
    };

    return table[difficulty][level] * quantity;
}