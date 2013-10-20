function leseVortragsStatus() {
    $.ajax({
        dataType:'jsonp',
        data:{mode:"userlogindone", uid:window.localStorage.getItem("hash")},
        jsonp:'jsonp_callback',
        url:getServer() + getPath() + 'ajax_vortrag.php',
        success:function (data) {
            console.log(data);
            enableDisableVotings(data);
            manageGui();
        }
    });
}

function enableDisableVotings(data) {
    /* Hauptarray */
    $('.vortragWrapper').hide();
    $('.vortragWrapper').removeClass('ui-disabled').addClass('ui-disabled');
    dlength = data.length;
    var dummyHtml = $('#dummyVoting').html();
    for (var i = 0; i < dlength; i++) {

        /* DYNAMISCHE VERSION
         var votingBlock = dummyHtml.replace(/XXX/g, i);
         votingBlock = votingBlock.replace("K1",data[0].keins);
         votingBlock = votingBlock.replace("K2",data[0].kzwei);
         votingBlock = votingBlock.replace("K3",data[0].kdrei);
         var ziel = $('#votingZiel').html();
         var testhtml  = "<div id='aussen'><div>Kategorie 1</div><input type=range min=1 max=50 value=10 id='#slider-fill_0_3'></div>";
         $('#votingZiel').append(votingBlock);
         $.mobile.slider.prototype.options.initSelector = ".myslider";
         $('#slider-fill_0_1').slider();

         $('#slider-fill_0_2').slider();

         $('#slider-fill_0_3').slider();
         */
        /* Vortrag */
        vortrag = data[i];
        console.log("enableDisableVotings:" + vortrag.vtitel + " ist aktiv " + vortrag.aktiv );
        if (vortrag.aktiv == 1) {
            $('#vortragWrapper_' + i + " h4").html(vortrag.vautor  + ": " + vortrag.vtitel);
            /*var votingBlock = "";
             votingBlock = $('#vortragWrapper_' + i).html().replace("K1",data[0].keins);
             votingBlock = votingBlock.replace("K2",data[0].kzwei);
             votingBlock = votingBlock.replace("K3",data[0].kdrei);*/

            $('#vortragWrapper_' + i).children().eq(1).children().eq(0).html(data[0].keins);
            $('#vortragWrapper_' + i).children().eq(1).children().eq(2).html(data[0].kzwei);
            $('#vortragWrapper_' + i).children().eq(1).children().eq(4).html(data[0].kdrei);
            // keine Punkte bisher vergeben
            if (vortrag.eigenePunkte.length == 0) {
                $('#vh_' + i + "").val(vortrag.vid);
                $('#vortragWrapper_' + i + "").show();
                $('#vortragWrapper_' + i + "").removeClass('ui-disabled');
                $('#vote_' + i + "").click(function () {
                    bewerten(this.id);
                })
            }
            else {
                $('#vortragWrapper_' + i + "").show();
                $('#vote_' + i + "").hide();
                $('#slider-fill_' + i + "_1-label").hide();
                $('#slider-fill_' + i + "_2-label").hide();
                $('#slider-fill_' + i + "_3-label").hide();
                $('#slider-fill_' + i + "_1").hide();
                $('#slider-fill_' + i + "_2").hide();
                $('#slider-fill_' + i + "_3").hide();
                $('#vortragWrapper_' + i + " .ui-slider").hide();
                $('#vortragWrapper_' + i + " .ui-slider").addClass('hidden');
                $('#vortragWrapper_' + i + " .dummywrapper").addClass('hidden');
                punkte1 = 0;
                punkte2 = 0;
                punkte3 = 0;
                for (var e = 0; e < vortrag.eigenePunkte.length; e++) {
                    punkteArray = vortrag.eigenePunkte[e];
                    if (vortrag.eigenePunkte[e].kriterium == 1) {
                        punkte1 = parseInt(punkte1 + vortrag.eigenePunkte[e].punkte);
                        $('#slider-fill_' + i + "_1").val(vortrag.eigenePunkte[e].punkte);
                    }
                    else if (vortrag.eigenePunkte[e].kriterium == 2) {
                        punkte2 = parseInt(punkte2 + vortrag.eigenePunkte[e].punkte);
                        $('#slider-fill_' + i + "_2").val(vortrag.eigenePunkte[e].punkte);
                    }
                    else if (vortrag.eigenePunkte[e].kriterium == 3) {
                        punkte3 = parseInt(punkte3 + vortrag.eigenePunkte[e].punkte);
                        $('#slider-fill_' + i + "_3").val(vortrag.eigenePunkte[e].punkte);
                    }
                }
                if (vortrag.gesPunkte.length > 0) {
                    for (var e = 0; e < vortrag.gesPunkte.length; e++) {
                        punkteArray = vortrag.gesPunkte[e];
                        if (vortrag.gesPunkte[e].kriterium == 1) {
                            punkte1 = parseInt(punkte1 + vortrag.gesPunkte[e].punkte);
                        }
                        else if (vortrag.gesPunkte[e].kriterium == 2) {
                            punkte2 = parseInt(punkte2 + vortrag.gesPunkte[e].punkte);
                        }
                        else if (vortrag.gesPunkte[e].kriterium == 3) {
                            punkte3 = parseInt(punkte3 + vortrag.gesPunkte[e].punkte);
                        }
                    }
                }
                $('#vortrag_erg_' + i + "").show();
                /*$('#vortrag_erg_' + i + "").html("Meine Bewertung:<div class=\"kritzusammenfassung\"> - " + data[0].keins + ": " + punkte1 + " Punkte</div><div class=\"kritzusammenfassung\"> - " + data[0].kzwei + ": " + punkte2 + " Punkte</div><div class=\"kritzusammenfassung\"> - " + data[0].kdrei + ": " + punkte3 + " Punkte</div>");*/
                $('#vortrag_erg_' + i + "").html("<div class=\"kritzusammenfassung\">Bereits bewertet</div>");
            }
        }
    }


}

function bewerten(theid) {
    bid = theid.split('_');
    namea = "slider-fill_" + bid[1] + "_1";
    nameb = "slider-fill_" + bid[1] + "_2";
    namec = "slider-fill_" + bid[1] + "_3";

    $('#vote_' + bid[1]).removeClass('ui-disabled').addClass('ui-disabled');

    $('#bewerten_laden_' + bid[1]).show();
    $.ajax({
        dataType:'jsonp',
        data:{mode:"bewerten", vid:$('#vh_' + bid[1]).val(), u:window.localStorage.getItem("hash"), a:$('#' + namea).val(), b:$('#' + nameb).val(), c:$('#' + namec).val()},
        jsonp:'jsonp_callback',
        url:getServer() + getPath() + 'ajax_vortrag.php',
        success:function (data) {
            if (data.a && data.b && data.c) {
                leseVortragsStatus();
                manageGui();
            }
            else {
                alert("Fehler bei der Bewertung");
            }

        }
    });
    $('#bewerten_laden_' + bid[1]).hide();
}

function waslaeuftjetzt() {
    aktuell = "";
    diezeile = "";
    $.ajax({
        dataType:'jsonp',
        data:{mode:"waslaeuftjetzt"},
        jsonp:'jsonp_callback',
        url:getServer() + getPath() + 'ajax_programm.php',
        success:function (data) {
            theaktuell = "<li class=\"ui-li ui-li-static ui-body-c\">XXX</li>";
            console.log("waslaeuftjetzt() - ");
            console.log("waslaeuftjetzt() - " + data);
            if (data.gelesen) {
                diezeile = theaktuell.replace("XXX", data.info);
                aktuell = aktuell + diezeile;
            }
            else {
                diezeile = theaktuell.replace("XXX", "Derzeit läuft kein Vortrag");
                aktuell = aktuell + diezeile;
            }
            $('#waslaeuftjetzt').html(aktuell);
        }
    });
}