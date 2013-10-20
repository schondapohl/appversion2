function starteAnfrage() {
    anfragen = anfragen + 1;
    $('#anfragenaktiv').show();
}

function beendeAnfrage() {
    anfragen = anfragen - 1;
    if (anfragen == 0) {
        $('#anfragenaktiv').hide();
    }
}

function verbindungAbrechen() {
    anfragen = 1;
    beendeAnfrage();
}

function clientListen() {
    socket = io.connect('http://app.emzed.de:8081');
    socket.on('connecting', function () {
        damNotConnected();
        console.log("Socket is connecting");
    });
    socket.on('connect', function () {
        console.log("Socket is connected");
        damConnected();
        umfrageAktiv();
    });
    socket.on('connect_failed', function () {
        console.log("Connection is failed");
        damNotConnected();
    });
    socket.on('message', function (message, callback) {
        console.log(message);
        damConnected();
        if (message.typ == 1) {
            if (message.neu == true) {
                $('#v_frage').html(message.frage);
                $('#v_a').html(message.a);
                $('#v_b').html(message.b);
                $('#v_c').html(message.c);
                $('#v_d').html(message.d);
                $('#v_value').val(message.fid);
                //$('#votingLink').click();
                $('#votingDiv').removeClass('hidden visibleVotingDiv').addClass('visibleVotingDiv');
                $('#umfrageTabelletd1').height($('#votingDiv').height() / 2);
                $('#umfrageTabelletd2').height($('#votingDiv').height() / 2);
                $('#umfrageTabelletd3').height($('#votingDiv').height() / 2);
                $('#umfrageTabelletd4').height($('#votingDiv').height() / 2);
            }
            else if (message.beendet == true) {
                window.localStorage.removeItem("frage");
            }
        }
        if (message.typ == 2) {
            if (message.beendet == true) {
                //$('#popupDialog').popup("close");
                $('#votingDiv').removeClass('hidden visibleVotingDiv').addClass('hidden');
            }
            else if (message.beendet == true) {
                window.localStorage.removeItem("frage");
            }
        }
        if (message.typ == 3) {
            leseVortragsStatus();
        }
        if (message.typ == 99) {
            if (typeof device === "undefined") {
                alert(message.servermessage);
            }
            else {
                navigator.notification.alert(message.servermessage);
            }
        }
    });
    socket.on('firstConnection', function () {
        damConnected();
        if (typeof device === "undefined") {
            alert('Erster Connect!');
        }
        else {
            navigator.notification.alert('First Connect');
        }
    });
    socket.on('reconnecting', function () {
        damNotConnected();
        console.log("Reconnecting to Socket");
    });
    socket.on('reconnect', function () {
        damNotConnected();
        console.log("Reconnection is completed");
    });
    socket.on('reconnect_failed', function () {
        damNotConnected();
        console.log("Reconnection is failed");
    });
    socket.on('disconnect', function () {
        damNotConnected();
        console.log("Socket is disconnected");
    });
}

function delayedConnectionTry() {
    starteAnfrage();
    $('#anfragenaktiv').delay(1500).fadeOut('slow', function () {
        verbindungAbrechen();
    });
    if (typeof socket === "undefined") {
        verbindungsVersuche = verbindungsVersuche + 1;
        if (verbindungsVersuche > 3) {
            if (typeof device === "undefined") {
                alert('DAM App Server derzeit nicht erreichbar. Bitte pruefen Sie Ihre Internetverbindung oder versuchen Sie es spaeter erneut!');
            }
            else {
                navigator.notification.alert('DAM App Server derzeit nicht erreichbar. Bitte pruefen Sie Ihre Internetverbindung oder versuchen Sie es spaeter erneut!');
            }
        }
        else {
            clientListen();
        }
    }
    else {
        if (socket.socket.connected == false) {
            verbindungsVersuche = verbindungsVersuche + 1;
            if (verbindungsVersuche > 3) {
                if (typeof device === "undefined") {
                    alert('DAM App Server derzeit nicht erreichbar. Bitte pruefen Sie Ihre Internetverbindung oder versuchen Sie es spaeter erneut!');
                }
                else {
                    navigator.notification.alert('DAM App Server derzeit nicht erreichbar. Bitte pruefen Sie Ihre Internetverbindung oder versuchen Sie es spaeter erneut!');
                }
            }
            else {
                clientListen();
            }
        }
        else {
            console.log("Bereits verbunden");
            damConnected();
        }
    }
}