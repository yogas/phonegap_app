

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


function checkSession() {
	ajax("check_server_session");
}


function ajax_response_ctrl(g, res) {
	switch(g) {
		case 'auth_user':
			if (res.token) {
            	//document.getElementById("user_pass").style.border = "solid 1px red";
                localStorage.setItem("acc_sessionID", 1);
                //window.localStorage["user_email"] = res.data;
                $.mobile.changePage('#devices');
                getDataFromServer();
			} else {
                localStorage.setItem("acc_sessionID", 0);
                //window.localStorage["user_email"] = null;
                $.mobile.changePage('#auth');
			}
            //console.log(window.localStorage["acc_sessionID"]);
            //console.log(window.localStorage["user_email"]);
		break;
        case 'get_devices_list':
            if (res.data) {
                var html_source = '<ul>';

                for (var t=0; t!=res.data.length; t++) {
                    html_source += '<li><b>Device ID:</b> '+ res.data[t]['id'] +'</li>';
                    html_source += '<li><b>Device Name:</b> '+ res.data[t]['name'] +'</li>';
                    html_source += '<li><b>Device Type:</b> '+ res.data[t]['type'] +'</li>';
                    html_source += '<li><b>Device Object:</b> '+ res.data[t]['object'] +'</li>';
                    html_source += '<li><b>Device Parent Object:</b> '+ res.data[t]['parent_object'] +'</li>';
                    html_source += '<li><b>Device Identifier:</b> '+ res.data[t]['identifier'] +'</li>';
                }

                html_source += '</ul>';

                $("#devices-page-content").html("");
                $("#devices-page-content").html(html_source);

                //console.log($("#index-page-content"));
            } else {
                //console.log();
            }
        break;
		case 'check_server_session':
            if (null !== res.data) {
                localStorage.setItem("acc_sessionID", 1);
                //console.log(window.localStorage["acc_sessionID"]);
            } else {
                localStorage.setItem("acc_sessionID", 0);
                //localStorage["user_email"] = null;
                $.mobile.changePage('#auth');
            }
            //console.log(window.localStorage["acc_sessionID"]);
            //console.log(window.localStorage["user_email"]);
		break;
	}
}


function ajax(g, oid) {
	var xmlhttp = getXmlHttp();

	if (g == "auth_user") {
		var user_email = document.getElementById("user_email").value;
		var user_pass = document.getElementById("user_pass").value;
        window.localStorage["user_email"] = user_email;
        xmlhttp.open('GET', 'http://dev.hashing24.sale/main/login?&fields[login]='+user_email+'&fields[password]='+user_pass, true);
	} else if (g == "check_server_session") {
        xmlhttp.open('GET', 'http://dev.hashing24.sale/main/checkSession', true);
	} else if (g == "get_devices_list") {
        xmlhttp.open('GET', 'http://dev.hashing24.sale/main/getDevices', true);
	} else {
        //xmlhttp.open('GET', 'http://super.aspen.ru/mobile_ajax_files/test.php?operation='+g+'&eri='+app_ex_run_id+'&rndtik='+randomNum, true);
	}

	//xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlhttp.send();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
				ajax_response_ctrl(g, JSON.parse(xmlhttp.responseText));
			}
		}
	};
}


function auth_user() {
	if(document.getElementById("user_email").value != "" && document.getElementById("user_pass").value != "") {
		document.getElementById("user_email").className = "text-fields";
		document.getElementById("user_pass").className = "text-fields";
		ajax("auth_user");
	}else {
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

