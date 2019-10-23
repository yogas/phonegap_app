

function checkDevices(tt) {
    alert(tt);
    ajax('check_devices');
}


function exit( status ) {
    // *     example 1: exit();
    // *     returns 1: null

    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation (e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) {stopPropagation(e);}, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}


function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


function getXmlHttp() {
	var xmlhttp;
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
	try {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	} catch (E) {
		xmlhttp = false;
	}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}


function getDataFromServer() {
	ajax("get_devices_list");
}


/*
function getMySessionID() {
    if (window.localStorage["acc_sessionID"] = 1) {
        return 1;
    } else {
        return 0;
    }
}
*/


function getDeviceDetailData(oid) {
    $("#device-detail-page-content").html("");
    checkSession();
    ajax("get_device_detail", oid);
    $.mobile.changePage('#device-detail');
}


function checkSession() {
	ajax("check_server_session");
}


function ajax_response_ctrl(g, res) {
	switch(g) {
		case 'auth_user':
			if (res.token) {
                $("#auth-error-msg").html("");
                window.localStorage["acc_sessionID"] = 1;
                window.localStorage["user_email"] = res.data;
                $.mobile.changePage('#devices');
                getDataFromServer();
                //checkDevices();
                //setInterval("checkDevices()", 300000);
			} else {
                window.localStorage["acc_sessionID"] = 0;
                window.localStorage["user_email"] = null;
                $.mobile.changePage('#auth');
                $("#auth-error-msg").html(res.error_msg);
			}
		break;
        case 'get_devices_list':
            if (res.data) {
                var html_source = '<h1>СПИСОК РЕЗЕРВУАРОВ</h1>';

                for (var t=0; t!=res.data.length; t++) {
                    if (res.data[t]['has_alarm'] == false || parseInt(res.data[t]['has_alarm']) == 0) {
                        //document.getElementById("param-alert").style = style;
                        var alarm = '<div class="param-block" id="param-alert"><span class="alert">Авария</span>нет</div>';
                        //var style = '';
                    } else {
                        //document.getElementById("param-alert").style = "";
                        var alarm = '<div class="param-block" style="box-shadow:0px 1px 10px rgba(0, 0, 0, 0.30) !important; font-size:36px !important; padding-bottom:12px !important; background-color:#BE3D3D !important; font-family:\'Roboto-Bold\' !important; color:#FFFFFF !important;"><span class="alert">Авария</span><div style="clear:both; width:100%;">!</div></div>';
                        //var style = '';
                    }

                    html_source += '<a href="#" onclick="getDeviceDetailData('+res.data[t]['id']+')" style="margin-bottom:15px; display:block; max-width:585px; margin:0 auto;"><div class="devoce-smart-block">';
                    html_source += '<div class="row" style="padding-top:15px;">';
                    html_source += '<div class="device-param-label">Компания</div>';
                    html_source += '<div class="device-param-value">'+ res.data[t]['parent_object'] +'</div>';
                    html_source += '</div>';
                    html_source += '<div class="clr"></div>';
                    html_source += '<div class="row">';
                    html_source += '<div class="device-param-label">Объект</div>';
                    html_source += '<div class="device-param-value">'+ res.data[t]['object'] +'</div>';
                    html_source += '</div>';
                    html_source += '<div class="clr"></div>';
                    html_source += '<div class="row">';
                    html_source += '<div class="device-param-label">Резервуар</div>';
                    html_source += '<div class="device-param-value">'+ res.data[t]['name'] +'</div>';
                    html_source += '</div>';
                    html_source += '<div class="clr"></div>';
                    html_source += '<div class="row-blocks">';
                    html_source += '<div class="param-block" style="margin-right:35px;">';
                    html_source += '<span class="temp">Температура, С</span>';
                    html_source += res.data[t]['temp'];
                    html_source += '</div>';
                    html_source += '<div class="param-block" id="param-block-volume" style="margin-left:5px;">';
                    html_source += '<span class="volume">Объем, м<sup>3</sup></span>';
                    html_source += res.data[t]['volume'];
                    html_source += '</div>';
                    html_source += alarm;
                    html_source += '</div>';
                    html_source += '</div></a>';
                }

                $("#devices-page-content").html("");
                $("#devices-page-content").html(html_source);

                //checkDevices();

            } else {
                checkSession();
            }
        break;
		case 'check_server_session':
            if (null !== res.data) {
                window.localStorage["acc_sessionID"] = 1;
            } else {
                window.localStorage["acc_sessionID"] =  0;
                window.localStorage["user_email"] = null;
                $.mobile.changePage('#auth');
            }
		break;
        case 'get_device_detail':
            if (res.data) {
                var detail_page_html_source = '<h1 style="margin-bottom:0 !important;">РЕЗЕРВУАР '+res.data['name']+'</h1>';
                detail_page_html_source += '<h2 style="margin-top:0 !important;">'+res.devices['object']+'</h2>';

                var tens = new Array();
                var tempos = new Array();
                var tempos_codes = new Array();
                var tens_codes = new Array();

                var tens_manuals = new Array();
                var tens_alarm = new Array();
                var tens_manuals_finish = new Array();
                var tens_alarm_finish = new Array();

                var gtn = 1;
                var gtn2 = 1;
                var gtn3 = 1;
                var gtn4 = 1;
                var gtn5 = 1;

                var tens_finish = new Array();
                var tempos_finish = new Array();
                var diam = 0;
                var dh = 0;
                var h = 0;
                var tos = 0;
                var sn = 0;

                var tensGraphLevel = new Array();
                var tensGraphLevel_finish = new Array();

                for (var n=0; n!=res.data.parameters.length; n++) {
                    var code = String(res.data.parameters[n].code);
                    if (code == "Tn"+gtn3+"_Manual") {
                        if (parseInt(res.data.parameters[n].value) == 1 || res.data.parameters[n].value == "1") {
                            tens_manuals[n] = 'P';
                        } else {
                            tens_manuals[n] = 'A';
                        }
                        gtn3++;
                    }
                    if (code == "Tn"+gtn4+"_Fau") {
                        if (parseInt(res.data.parameters[n].value) == 1 || res.data.parameters[n].value == "1") {
                            tens_alarm[n] = '#BE3D3D';
                        } else {
                            tens_alarm[n] = '#3DBE52';
                        }
                        gtn4++;
                    }

                    if (code == "vL"+gtn5 || code == "vL"+gtn5+"_PZ") {
                        tensGraphLevel[n] = res.data.parameters[n].value;
                        gtn5++;
                    }


                    if (code == "Tn"+gtn) {
                        tens[n] = res.data.parameters[n].value;
                        tens_codes[n] = code;
                        gtn++;
                    }
                    if (code == "T"+gtn2) {
                        tempos[n] = res.data.parameters[n].value;
                        tempos_codes[n] = code;
                        gtn2++;
                    }
                    if (code == "Diam") {
                        diam = res.data.parameters[n].value;
                    }
                    if (code == "L") {
                        dh = res.data.parameters[n].value;
                    }
                    if (code == "H") {
                        h = res.data.parameters[n].value;
                    }
                    if (code == "T_OS") {
                        tos = res.data.parameters[n].value;
                    }
                    if (code == "Sn") {
                        sn = res.data.parameters[n].value;
                    }
                }

                var t = 0;
                for (var n=tens_manuals.length; n!=0; n--) {
                    if (undefined !== tens_manuals[n]) {
                        tens_manuals_finish[t] = tens_manuals[n];
                        t++;
                    } else {
                        continue;
                    }
                }
                var t = 0;
                for (var n=tens_alarm.length; n!=0; n--) {
                    if (undefined !== tens_alarm[n]) {
                        tens_alarm_finish[t] = tens_alarm[n];
                        t++;
                    } else {
                        continue;
                    }
                }
                var t = 0;
                for (var n=tensGraphLevel.length; n!=0; n--) {
                    if (undefined !== tensGraphLevel[n]) {
                        tensGraphLevel_finish[t] = tensGraphLevel[n];
                        t++;
                    } else {
                        continue;
                    }
                }

                var t = 0;
                for (var n=0; n!=tens.length; n++) {
                    if (undefined !== tens[n]) {
                        tens_finish[t] = tens[n];
                        t++;
                    } else {
                        continue;
                    }
                }
                t = 0;
                for (var n=0; n!=tempos.length; n++) {
                    if (undefined !== tempos[n]) {
                        tempos_finish[t] = tempos[n];
                        t++;
                    } else {
                        continue;
                    }
                }


                var tLevels_percent = new Array();
                var tLevels = new Array();

                var radius = diam / 2;
                var rkv = radius * radius;
                var v = 3.14 * rkv * dh;
                var l = v * 1000;
                var ten_of_section = tens_finish.length / tempos_finish.length;

                var deviceDt = '';
                var device_wf_h = 540;//document.getElementById("device-work-frame").offsetHeight;

                var maxLevel_percent = Math.floor((tensGraphLevel_finish[0] * 100) / h);
                var maxLevel = Math.floor((device_wf_h / 100) * maxLevel_percent);
                deviceDt += '<div class="max-level-brd" style="margin-top:'+(device_wf_h - maxLevel)+'px;"><span class="max-lavel-block">MAX</span></div>';

                var lowLevel_percent = Math.floor((tensGraphLevel_finish[tensGraphLevel_finish.length - 1] * 100) / h);
                var lowLevel = Math.floor((device_wf_h / 100) * lowLevel_percent);
                deviceDt += '<div class="low-level-brd" style="margin-top:'+((device_wf_h - lowLevel) - 60)+'px;"><span class="low-lavel-block">НЕВЫБИРАЕМЫЙ ОСТАТОК</span></div>';

                tLevels_percent[0] = Math.floor((tensGraphLevel_finish[tensGraphLevel_finish.length - 2] * 100) / h);
                tLevels[0] = Math.floor((device_wf_h / 100) * tLevels_percent[0]);

                var minLevel_percent = Math.floor((tensGraphLevel_finish[tensGraphLevel_finish.length - 3] * 100) / h);
                var minLevel = Math.floor((device_wf_h / 100) * minLevel_percent);


                tLevels_percent[1] = Math.floor((tensGraphLevel_finish[tensGraphLevel_finish.length - 4] * 100) / h);
                tLevels[1] = Math.floor((device_wf_h / 100) * tLevels_percent[1]);

                tLevels_percent[2] = Math.floor((tensGraphLevel_finish[tensGraphLevel_finish.length - 5] * 100) / h);
                tLevels[2] = Math.floor((device_wf_h / 100) * tLevels_percent[2]);
                //tLevels[2] = maxLevel;

                var one_percent_H = Math.floor((h / 100) * 10000) / 10000;
                var percents_L = Math.floor((dh / one_percent_H) * 100) / 100;
                var vodichkaHeight = Math.ceil((device_wf_h / 100) * percents_L);

                var dtn2 = tens_manuals_finish.length - 1;
                var dtn3 = 1;
                for(var dtn=0; dtn!=tempos_finish.length; dtn++) {
                    if (dtn == (tempos_finish.length - 1) || dtn == (tempos_finish.length - 2)) {
                        var lineheight = 6;
                        var tens_lineheight = 0;
                        var tens_lineheight2 = 0;
                    } else {
                        var lineheight = 0;
                        var tens_lineheight = (ten_of_section * 25) + (5 * ten_of_section);
                        var tens_lineheight2 =  35;
                    }

                    if (parseInt(tens_finish[dtn]) < 1) {
                        tens_alarm_finish[dtn] = "#cccccc";
                    }

                    var bgs = '';
                    if (parseInt(tempos_finish[dtn]) >= 5 && parseInt(tempos_finish[dtn]) <= 60) {
                        bgs = "#3DBE52";
                    } else if (parseInt(tempos_finish[dtn]) > 60) {
                        bgs = "#BE3D3D";
                    } else if (parseInt(tempos_finish[dtn]) < 5) {
                        bgs = "#3D88BE";
                    }

                    deviceDt += '<span class="device-dt" style="top:'+(((device_wf_h - tLevels[dtn]) - 60) + lineheight)+'px; background-color:'+bgs+'; left:-30px; line-height:2;">+'+tempos_finish[dtn]+' &#8451;</span>';
                    deviceDt += '<span style="top:'+((((device_wf_h - tLevels[dtn]) - 60) + lineheight) - tens_lineheight2)+'px; display:block; position:absolute; z-index:48; width:55px; float:right; right:-14px; clear:both;">';

                    var revert_alarms_data= new Array();
                    var revert_manuals_data= new Array();
                    var ten_numbers_data = new Array();
                    for (var tnn=0; tnn!=ten_of_section; tnn++) {
                        revert_alarms_data[tnn] = tens_alarm_finish[dtn2];
                        revert_manuals_data[tnn] = tens_manuals_finish[dtn2];
                        ten_numbers_data[tnn] = dtn3;
                        dtn2--;
                        dtn3++;
                    }
                    revert_alarms_data = revert_alarms_data.reverse();
                    revert_manuals_data = revert_manuals_data.reverse();
                    ten_numbers_data = ten_numbers_data.reverse();
                    for (var tnn=0; tnn!=ten_of_section; tnn++) {
                        deviceDt += '<span class="device-tn" style="background-color:'+revert_alarms_data[tnn]+';">'+revert_manuals_data[tnn]+'</span><span class="ten-title">ТЕН '+ten_numbers_data[tnn]+'</span>';
                    }
                    deviceDt += '</span>';
                }

                deviceDt += '<div class="min-level-brd" style="top:'+((device_wf_h - minLevel) - 60)+'px;"><span class="min-lavel-block">MIN</span></div>';

                detail_page_html_source += '<div class="sn-block">№ '+sn+'<br>T_OS: '+tos+'</div>' +
                '<div class="device-schema-block">\n' +
                    '<div class="hight-level-brd"><span class="hight-lavel-block">ПЕРЕЛИВ</span></div>' +
                    '<div class="device-work-frame" id="device-work-frame">'+deviceDt+'</div>' +
                    '<div class="vodichka" style="height:'+vodichkaHeight+'px; margin-top:-'+(vodichkaHeight + 46)+'px;"><div style="color:#000000; text-align:left; margin-left:15px; padding-top:5px;">'+dh+' м / '+h+' м</div><div class="vodichka-text">' + numberWithSpaces(Math.floor(l * 10) / 10) + ' л</div>' +
                '</div>';


                $("#device-detail-page-content").html("");
                $("#device-detail-page-content").html(detail_page_html_source);
            } else {

            }
        break;
        case 'check_devices':
            alert(res);
            if (res.data) {
                alert(res.data);
                console.log(res.data);
            } else {
                alert(0);
                console.log(0);
            }
        break;
	}
}


function ajax(g, oid) {
	var xmlhttp = getXmlHttp();
    var randomNum = Math.round((Math.random() * (40000 - 1) + 1));

	if (g == "auth_user") {
		var user_email = document.getElementById("user_email").value;
		var user_pass = document.getElementById("user_pass").value;
        window.localStorage["user_email"] = user_email;
        xmlhttp.open('GET', 'http://dev.hashing24.sale/main/login?&fields[login]='+user_email+'&fields[password]='+user_pass+'&rndtik='+randomNum, true);
	} else if (g == "check_server_session") {
        xmlhttp.open('GET', 'http://dev.hashing24.sale/main/checkSession?&identifer='+window.localStorage["user_email"]+'&rndtik='+randomNum, true);
	} else if (g == "get_devices_list") {
        xmlhttp.open('GET', 'http://dev.hashing24.sale/main/getDevices?&identifer='+window.localStorage["user_email"]+'&rndtik='+randomNum, true);
	} else if (g == "get_device_detail") {
        xmlhttp.open('GET', 'http://dev.hashing24.sale/main/getDeviceDetail?&identifer='+window.localStorage["user_email"]+'&did='+oid+'&rndtik='+randomNum, true);
	} else if (g == "check_devices") {
        //alert(123);
        xmlhttp.open('GET', 'http://dev.hashing24.sale/main/checkDevices?&token='+localStorage.getItem('registrationId')+'&identifer='+window.localStorage["user_email"]+'&rndtik='+randomNum, true);
    } else {
        //xmlhttp.open('GET', 'http://super.aspen.ru/mobile_ajax_files/test.php?operation='+g+'&eri='+app_ex_run_id+'&rndtik='+randomNum, true);
	}

	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.send();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
                //alert(xmlhttp.status);
				ajax_response_ctrl(g, JSON.parse(xmlhttp.responseText));
			}
		}
	};
}


function auth_user() {
	if (document.getElementById("user_email").value != "" && document.getElementById("user_pass").value != "") {
		document.getElementById("user_email").className = "text-fields";
		document.getElementById("user_pass").className = "text-fields";
		ajax("auth_user");
	} else {
		if(document.getElementById("user_email").value == "") {
			document.getElementById("user_email").className = "text-fields error";
		}else {
			document.getElementById("user_email").className = "text-fields";
		}
		if(document.getElementById("user_pass").value == "") {
			document.getElementById("user_pass").className = "text-fields error";
		}else {
			document.getElementById("user_pass").className = "text-fields";
		}
	}
}

