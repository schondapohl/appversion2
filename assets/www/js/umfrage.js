function abstimmen(antwort) {
    console.log("Abgestimmt fuer " + $('#v_value').val() + " mit " + antwort);
    $('#votingLoading').show();
    $('#umfrageTabelle').hide();
    var uid = null;
    if (typeof device === "undefined") {
        uid = uniqueID;
    }
    else {
        uid = device.name;
    }
    console.log("ID " + uid);

    $.ajax({
        dataType:'jsonp',
        data:{mode:'abstimmen', fid:$('#v_value').val(), a:antwort, u:uid},
        jsonp:'jsonp_callback',
        url:getServer() + getPath() + 'abstimmen.php',
        success:function (data) {
            if (data.gezaehlt == true) {
                console.log('Stimme erfasst');
                if (typeof device === "undefined") {
                    alert('Vielen Dank. Ihre Stimme wurde erfasst!');
                }
                else {
                    navigator.notification.alert('Vielen Dank. Ihre Stimme wurde erfasst!');
                }
                $('#votingDiv').removeClass('hidden visibleVotingDiv').addClass('hidden');
            }
            else {
                console.log('Stimme nicht erfasst');
                if (typeof device === "undefined") {
                    alert('Stimme wurde nicht erfasst!');
                }
                else {
                    navigator.notification.alert('Stimme wurde nicht erfasst!');
                }
            }
        }
    });
    $('#umfrageTabelle').show();
    $('#votingLoading').hide();
}

function umfrageAktiv() {
    console.log("umfrageAktiv() - Pruefen ob Umfrage aktiv ist ...");
    var uid = null;
    if (typeof device === "undefined") {
        uid = uniqueID;
    }
    else {
        uid = device.uuid;
    }
    console.log("umfrageAktiv() - Meine UniqueID " + uid);
    $.ajax({
        dataType:'jsonp',
        data:{mode:'pruefeAufAktiveUmfrage', gid:uid},
        jsonp:'jsonp_callback',
        url:getServer() + getPath() + 'abstimmen.php',
        success:function (data) {
            zeigeAppGui();
            zeigeStartLogo = false;
            console.log("umfrageAktiv() - Antwortdaten");
            console.log(data);
            if (data.gestartet == true) {
                $('#v_frage').html(data.frage);
                $('#v_a').html(data.a);
                $('#v_b').html(data.b);
                $('#v_c').html(data.c);
                $('#v_d').html(data.d);
                $('#v_value').val(data.fid);
                //$('#votingLink').click();
                if (data.abgestimmt == false) {
                    $('#votingDiv').removeClass('hidden visibleVotingDiv').addClass('visibleVotingDiv');
                    $('#umfrageTabelletd1').height(($('#votingDiv').height() / 2 ) - 20);
                    $('#umfrageTabelletd2').height(($('#votingDiv').height() / 2 ) - 20);
                    $('#umfrageTabelletd3').height($('#votingDiv').height() / 2);
                    $('#umfrageTabelletd4').height($('#votingDiv').height() / 2);
                }
            }
        }
    });
}