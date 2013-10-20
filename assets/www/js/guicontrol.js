var zeigeStartLogo = true;
var uniqueID = randomUUID();
var vortraegeGelesenNachLogin = false;
var serverconfig = 0;
var socket;
var verbindungsVersuche = 0;
var anfragen = 0;

function getServer() {
    if (serverconfig == 0) {
        return 'http://www.dam2013.org/';
    }
    else if (serverconfig == 1) {
        return 'http://localhost/';
    }
}

function getPath() {
    if (serverconfig == 0) {
        return 'app/';
    }
    else if (serverconfig == 1) {
        return 'dam/';
    }
}

function randomUUID() {
    var s = [], itoh = '0123456789ABCDEF';

    // Make array of random hex digits. The UUID only has 32 digits in it, but we
    // allocate an extra items to make room for the '-'s we'll be inserting.
    for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);

    // Conform to RFC-4122, section 4.4
    s[14] = 4;  // Set 4 high bits of time_high field to version
    s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

    // Convert to hex chars
    for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];

    // Insert '-'s
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
}





function generiereAutorenListe() {
    starteAnfrage();
    $.ajax({
        dataType:'jsonp',
        data:{mode:'generiereAutorenliste'},
        jsonp:'jsonp_callback',
        url:getServer() + getPath() + 'ajax_programm.php',
        success:function (data) {
            htmlcode = "";
            tag2found = false;
            counter = 0;
            eintrag = "<li class=\"ui-li ui-li-static ui-body-c\"><div>XXX</div><div class=\"fontnormal\">YYY</div><div class=\"fontnormal\">ZZZ</div><div class=\"fontnormal\">AAA</div></li>";
            eintrag2 = "<li class=\"ui-li ui-li-static ui-body-d\"><div>XXX</div><div class=\"fontnormal\">YYY</div><div class=\"fontnormal\">ZZZ</div><div class=\"fontnormal\">AAA</div></li>";
            dlength = data.length;
            console.log("generiereAutorenListe() - Antwortdaten " + dlength);
            for (var i = 0; i < dlength; i++) {
                if (i % 2 == 0) {
                    zeile = eintrag.replace("XXX", data[i].name);
                }
                else {
                    zeile = eintrag2.replace("XXX", data[i].name);
                }

                zeile = zeile.replace("YYY", data[i].institut != null ? data[i].institut : "");
                zeile = zeile.replace("ZZZ", data[i].strasse != null ? data[i].strasse : "");
                zeile = zeile.replace("AAA", data[i].ort != null ? data[i].ort : "");

                htmlcode = htmlcode + zeile;
                counter = counter + 1;
            }
            $('#autorenliste').html(htmlcode);
        }
    });
    beendeAnfrage();
}

function generiereProgramm() {
    starteAnfrage();
    $.ajax({
        dataType:'jsonp',
        data:{mode:'generiereProgramm'},
        jsonp:'jsonp_callback',
        url:getServer() + getPath() + 'ajax_programm.php',
        success:function (data) {
            htmlcode = "";
            tag2found = false;
            counter = 0;
            //console.log("generiereProgramm() - Antwortdaten");
            //console.log(data);
            eintrag = "<li class=\"ui-li ui-li-static ui-body-c\">XXX - YYY Uhr: <b>WWWZZZ</b><div class=\"expl fontnormal\">AAA<span id=\"more___\" class=\"mehrlesen\" onclick=\"mehrlesen('vidBBB')\">(weiterlesen)</span></div><div id=\"morecontentCCC\" style='display: none;'></div></li>";
            htag1 = "<li data-role=\"list-divider\" role=\"heading\" class=\"ui-li ui-li-divider ui-btn ui-bar-e ui-btn-up-undefined\">Tag 1 (21.11.2013)</li>";
            htag2 = "<li data-role=\"list-divider\" role=\"heading\" class=\"ui-li ui-li-divider ui-btn ui-bar-e ui-btn-up-undefined\">Tag 2 (22.11.2013)</li>";
            dlength = data.length;
            console.log("generiereProgramm() - Antwortdaten " + dlength);
            for (var i = 0; i < dlength; i++) {
                if (data[i].tag == 1 && counter == 0) {
                    htmlcode = htmlcode + htag1;
                }

                if (data[i].tag == 2 && tag2found == false) {
                    tag2found = true;
                    htmlcode = htmlcode + htag2;
                }

                zeile = eintrag.replace("XXX", data[i].von);
                zeile = zeile.replace("YYY", data[i].bis);
                if (data[i].pause == 1) {
                    zeile = zeile.replace("WWW", data[i].titel);
                    zeile = zeile.replace("ZZZ", "");
                }
                else {
                    zeile = zeile.replace("WWW", data[i].person + " - ");
                    zeile = zeile.replace("ZZZ", data[i].titel);
                }

                zeile = zeile.replace("AAA", data[i].hintergrund);
                zeile = zeile.replace("___", "_" + data[i].vid);
                zeile = zeile.replace("BBB", "_" + data[i].vid);
                zeile = zeile.replace("CCC", "_" + data[i].vid);
                htmlcode = htmlcode + zeile;
                counter = counter + 1;
            }
            $('#programmuebersicht').html(htmlcode);
        }
    });
    beendeAnfrage();
}

function mehrlesen(vid) {
    console.log("mehrlesen - " + vid);
    theid = vid.split('_');
    if ($('#more_' + theid[1]).html() == "Information verstecken") {
        $('#more_' + theid[1]).html("mehr lesen");
        $('#morecontent_' + theid[1]).toggle();
    }
    else {
        $.ajax({
            dataType:'jsonp',
            data:{mode:'leseMehrZuVortrag', id:theid[1]},
            jsonp:'jsonp_callback',
            url:getServer() + getPath() + 'ajax_programm.php',
            success:function (data) {
                $('#more_' + theid[1]).html("Information verstecken");
                $('#morecontent_' + theid[1]).html(data.response);
                $('#morecontent_' + theid[1]).toggle();
            }
        });
    }
}

function generiereTeilnehmerListe() {
    $.ajax({
        dataType:'jsonp',
        data:{mode:'generierTeilnehmerListe'},
        jsonp:'jsonp_callback',
        url:getServer() + getPath() + 'ajax_programm.php',
        success:function (data) {
            htmlcode = "";
            tag2found = false;
            counter = 0;
            console.log("generierTeilnehmerListe() - Antwortdaten");
            console.log(data);
            eintrag = "<li class=\"ui-li ui-li-static ui-body-c\">XXX</li>";
            dlength = data.length;
            for (var i = 0; i < dlength; i++) {
                zeile = eintrag.replace("XXX", data[i].info);
                htmlcode = htmlcode + zeile;
                counter = counter + 1;
            }
            $('#teilnehmerliste').html(htmlcode);
        }
    });
}

function initControls() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    zeigeStartLogo = false;
    zeigeAppGui();

    $('.showInfo').click(function () {
        $(this).find('.expl').toggle();
    })

    $('#v_d').click(function () {
        abstimmen('d');
    })

    $('#v_c').click(function () {
        abstimmen('c');
    })

    $('#v_b').click(function () {
        abstimmen('b');
    })

    $('#v_a').click(function () {
        abstimmen('a');
    })


    $('#umfrageTabelletd4').click(function () {
        abstimmen('d');
    })

    $('#umfrageTabelletd3').click(function () {
        abstimmen('c');
    })

    $('#umfrageTabelletd2').click(function () {
        abstimmen('b');
    })

    $('#umfrageTabelletd1').click(function () {
        abstimmen('a');
    })

    $('#noconnection').click(function () {
        delayedConnectionTry();
    })

    $('#connection').click(function () {
        //delayedConnectionTry();
    })

    $('#loginDiv').click(function () {
        $('#loginButton2').click();
    })

    $('#logoutDiv').click(function () {
        logoff();
    })

    $('#waslaeuft').bind('expand', function () {
        waslaeuftjetzt();
    });
}

function zeigeAppGui() {
    $('#startLogo').hide();
    $('.contentWrapper').show();
    $('#footerBar').show();
}

function loginStart() {
    $('.formElement').hide();
    $('#loginButton').hide();
    $('#loginLoader').show();
    $('#errorMessage').hide();

    if ($('#username').val() != "" && $('#userpw').val() != "") {
        $.ajax({
            dataType:'jsonp',
            data:{u:$('#username').val(), p:$('#userpw').val()},
            jsonp:'jsonp_callback',
            url:'http://www.dam2013.org/tl_files/dam/php/mobile/login.php',
            success:function (data) {
                if (data.login == true) {
                    window.localStorage.setItem("benutzer", data.u);
                    window.localStorage.setItem("hash", data.hash);
                    window.localStorage.setItem("voted", data.state);
                    window.localStorage.setItem("punkte", 0);
                    window.localStorage.setItem("status", 2);
                    if (data.m == true) {
                        $('#adminButton').show();
                    }
                    else {
                        $('#adminButton').hide();
                    }
                    $('.ui-dialog').dialog('close');
                    leseVortragsStatus();
                }
                else {
                    $('#errorMessage').html("Login nicht erfolgreich");
                    $('#errorMessage').fadeIn('slow');
                    $('.formElement').show();
                    $('#loginButton').show();
                    $('#loginLoader').hide();
                    window.localStorage.setItem("status", 1);
                    manageGui();
                }
            }
        });
    }
    else {
        $('#errorMessage').html("Benutzername und Passwort eingeben");
        $('#errorMessage').fadeIn('slow');
        $('.formElement').show();
        $('#loginButton').show();
        $('#loginLoader').hide();
        window.localStorage.setItem("status", 1);
    }
}

function showMenue()
{
    $('#menuContainer').toggle('fast');
}

function exitApp()
{
    logoff();
    console.log("Exit App");
    if(navigator.app){
        navigator.app.exitApp();
    }else if(navigator.device){
        navigator.device.exitApp();
    }
    else
    {
        logoff();
        alert("Sie können die Anwendung verlassen/minimieren");
    }
}

function zeigeImpressum()
{
    $('#impressumDiv').removeClass('hidden visibleImpressumDiv').addClass('visibleImpressumDiv');
}

function schliesseImpressum()
{
    $('#impressumDiv').removeClass('hidden visibleImpressumDiv').addClass('hidden');
}

/**
 * Für die Anzeige der jeweiligen Benutzer zuständig
 * Login oder Logout
 */
function manageGui() {
    if (typeof(window.localStorage) != 'undefined') {
        if (window.localStorage.getItem("status") != null && window.localStorage.getItem("status") == 2) {
            $('#loginDiv').hide();
            $('#logoutDiv').show();
            $('#abstimmungscontroller').removeClass("ui-disabled");
            $('#abstimmungsheadline').html("Vortr&auml;ge bewerten");
            $('#interactiveController').removeClass("ui-disabled");
            $('#interactiveControllerHeadline').html("Interaktiver Vortrag");
            console.log("manageGui - vortraegeGelesen " + vortraegeGelesenNachLogin )
            if (!vortraegeGelesenNachLogin) {
                leseVortragsStatus();
                vortraegeGelesenNachLogin = true;
                delayedConnectionTry();
            }
        }
        else {
            $('#loginDiv').show();
            $('#logoutDiv').hide();
            $('#abstimmungscontroller').addClass("ui-disabled");
            $('#abstimmungsheadline').html('Vortr&auml;ge bewerten (bitte einloggen)');
            $('#interactiveController').addClass("ui-disabled");
            $('#interactiveControllerHeadline').html("Interaktiver Vortrag (bitte einloggen)");
        }
    }
}

function logoff() {
    window.localStorage.clear();
    window.localStorage.setItem("status", 1);
    $('#loginDiv').show();
    $('#logoutDiv').hide();
    $('#abstimmungscontroller').addClass("ui-collapsible-collapsed");
    $('#interactiveController').addClass("ui-disabled");
    manageGui();
}

function damNotConnected() {
    $('#noconnection').show();
    $('#connection').hide();
}

function damConnected() {
    $('#noconnection').hide();
    $('#connection').show();
}

function verbindungpruefen() {
    if (typeof io === "undefined") {
        damNotConnected();
    }
}