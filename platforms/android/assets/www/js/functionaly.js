

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

function getDeviceDetailData(oid) {
    ajax("get_device_detail", oid);
    $.mobile.changePage('#device-detail');
}

function getSessionID() {
    return window.localStorage["acc_sessionID"];
}


function checkSession() {
	ajax("check_server_session");
}


function ajax_response_ctrl(g, res) {
	switch(g) {
		case 'auth_user':
            //alert(6576765756756);
			if (res.token) {
                //alert('xxxxxxxxxxxxxxxxxxxxx');
            	//document.getElementById("user_pass").style.border = "solid 1px red";
                window.localStorage["acc_sessionID"] = 1;
                window.localStorage["user_email"] = res.data;
                $.mobile.changePage('#devices');
                getDataFromServer();
			} else {
                //alert('yyyyyyyyyyyyyyyyyyyyyy');
                window.localStorage["acc_sessionID"] = 0;
                window.localStorage["user_email"] = null;
                $.mobile.changePage('#auth');
			}
		break;
        case 'get_devices_list':
            if (res.data) {
                var html_source = '';

                for (var t=0; t!=res.data.length; t++) {
                    if (res.data[t]['has_alarm'] !== false && parseInt(res.data[t]['has_alarm']) !== 0) {
                        var alarm = 'нет';
                    } else {
                        var alarm = 'да';
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
                    html_source += '30';
                    html_source += '</div>';
                    html_source += '<div class="param-block" style="margin-right:35px;">';
                    html_source += '<span class="volume">Объем, м<sup>3</sup></span>';
                    html_source += res.data[t]['volume'];
                    html_source += '</div>';
                    html_source += '<div class="param-block">';
                    html_source += '<span class="alert">Авария</span>';
                    html_source += alarm;
                    html_source += '</div>';
                    html_source += '</div>';
                    html_source += '</div></a>';
                }

                $("#devices-page-content").html("");
                $("#devices-page-content").html(html_source);

            } else {
                //console.log();
            }
        break;
		case 'check_server_session':
            if (null !== res.data) {
                window.localStorage["acc_sessionID"] = 1;
            } else {
                window.localStorage["acc_sessionID"] =  0;
                window.localStorage["user_email"] = null;
            }
		break;
        case 'get_device_detail':
            if (res.data) {
                var detail_page_html_source = '<h1 style="margin-bottom:0 !important;">РЕЗЕРВУАР '+res.data['name']+'</h1>';
                detail_page_html_source += '<h2 style="margin-top:0 !important;">'+res.devices['object']+'</h2>';

                var tens = new Array();
                var tempos = new Array();
                var gtn = 1;
                var gtn2 = 1;
                var tens_finish = new Array();
                var tempos_finish = new Array();

                for (var n=0; n!=res.data.parameters.length; n++) {
                    var code = String(res.data.parameters[n].code);
                    if (code == "Tn"+gtn) {
                        tens[n] = code;
                        gtn++;
                    }
                    if (code == "T"+gtn2) {
                        tempos[n] = code;
                        gtn2++;
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

                //console.log(tens_finish);
                //console.log(tempos_finish);

                detail_page_html_source += '<ul>';
                detail_page_html_source += '<li><b>Device ID:</b> '+ res.data['id'] +'</li>';
                detail_page_html_source += '<li><b>Device Name:</b> '+ res.data['name'] +'</li>';
                detail_page_html_source += '<li><b>Тэнов:</b> '+ tens_finish.length +'</li>';
                detail_page_html_source += '<li><b>Датчиков температуры:</b> '+ tempos_finish.length +'</li>';
                detail_page_html_source += '</ul>';

                $("#device-detail-page-content").html("");
                $("#device-detail-page-content").html(detail_page_html_source);
            } else {

            }
        break;
	}
}


function ajax(g, oid) {
	var xmlhttp = getXmlHttp();
    var randomNum = Math.round((Math.random() * (40000 - 1) + 1));

	if (g == "auth_user") {
	    //alert(33354545454);
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
    } else {
        //xmlhttp.open('GET', 'http://super.aspen.ru/mobile_ajax_files/test.php?operation='+g+'&eri='+app_ex_run_id+'&rndtik='+randomNum, true);
	}

	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.send();
	xmlhttp.onreadystatechange = function() {
	    //alert(xmlhttp.readyState);
	    //alert(xmlhttp.status);
	    //alert(xmlhttp.JSON.parse(xmlhttp.responseText));
		if (xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
				ajax_response_ctrl(g, JSON.parse(xmlhttp.responseText));
			}
		}
	};
}


function auth_user() {
    //alert('auth_user');
	if (document.getElementById("user_email").value != "" && document.getElementById("user_pass").value != "") {
		document.getElementById("user_email").className = "text-fields";
		document.getElementById("user_pass").className = "text-fields";
		ajax("auth_user");
        //alert('auth_user');
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

