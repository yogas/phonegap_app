


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

function buildMenu() {
	ajax("get_user_auth_data");
}

function getDataFromServer() {
	//buildMenu();
	ajax("get_devices_list");
}

function set_option_on_server(option, curValueBool) {
	if(curValueBool==true) {
		var curValue = 1;
	}else {
		var curValue = 0;
	}
	var k = 1;
	for(var t=0; t!=6; t++) {
		$("* .spy_mode_on-"+k).attr("value", curValue);
		$("* .push_notice_on-"+k).attr("value", curValue);
		k++;
	}
	ajax(option);
}


screensList = '';
screensListEdit = '';
sc = 1;


function updateServerSession() {
	ajax("update_server_session");
}

function ajax_response_ctrl(g, res) {
	switch(g) {
	    /*
		case 'get_app_list':
			if(res[1].acc_sessionID>0) {
				$("#app_auth_subm").attr("href", "#");
			}else {
				$("#app_auth_subm").attr("href", "javascript:auth_user();");
			}
			var html_source = '';
            for(var i=0; i!=res[0].length; i++) {
            	if(res[1].user_role_id==1) {
            		if(res[0][i].publish==0) {
						var apply_button = '<a href="javascript:apply_app('+res[0][i].appID+');" class="apply-link">Принять</a>';
            		}else {
                    	var apply_button = '';
            		}
					html_source += '<div class="app-list-item-block"><a href="#ditail-app-page" onclick="get_app_ditail_data('+res[0][i].appID+')"><div class="app-list-item"><img src="'+res[0][i].main_img+'" /><!--<div class="app-title-block">--><span class="ops-block2">'+res[0][i].name+'</span><span class="ops-block">'+res[0][i].os+'</span><!--</div>--><span class="app-desc-block">'+res[0][i].desc+'<div class="app-price-block"><span class="sale-perc-block"><span class="y-text">'+res[0][i].percent+'%</span> к продаже</span><span class="sale-perc-block-2"><span class="y-text"><b>'+res[0][i].price+'</b></span> <span class="rub">&#8399;</span></span></div></span></div></a></div><div class="app-list-item-links-block">'+apply_button+'<a href="#edit-app-page" onclick="edit_app('+res[0][i].appID+')" id="edit-app-link" class="edit-link">Править</a><a href="javascript:delete_app('+res[0][i].appID+');" class="delete-link">Удалить</a></div>';
            	}else {
					html_source += '<div class="app-list-item-block"><a href="#ditail-app-page" onclick="get_app_ditail_data('+res[0][i].appID+')"><div class="app-list-item"><img src="'+res[0][i].main_img+'" /><!--<div class="app-title-block">--><span class="ops-block2">'+res[0][i].name+'</span><span class="ops-block">'+res[0][i].os+'</span><!--</div>--><span class="app-desc-block">'+res[0][i].desc+'<div class="app-price-block"><span class="sale-perc-block"><span class="y-text">'+res[0][i].percent+'%</span> к продаже</span><span class="sale-perc-block-2"><span class="y-text"><b>'+res[0][i].price+'</b></span> <span class="rub">&#8399;</span></span></span></div></div></a></div>';
            	}
            }
			$("#app-content-index").html("");
			$("#app-content-index").html(html_source);
		break;
		*/
		//*****************
		case 'auth_user':
			if(res.state==1) {
            	document.getElementById("user_pass").style.border = "solid 1px red";
			}else if(res.state==22) {
				window.localStorage["new_user_phone"] = res.user_phone_num;
                document.getElementById("user_sms_code").value = "";
				$("* #number-confirm-page").click();
			}else {
				window.localStorage["acc_sessionID"] = res.acc_sessionID;
				window.localStorage["acc_phoneNum"] = res.user_phone_num;
				window.localStorage.removeItem("new_user_phone");
				buildMenu();
				$("#index-page").click();
			}
		break;
        case 'get_devices_list':
            if(res.data) {
                var html_source = '<ul>';

                for(var t=0; t!=res.data.length; t++) {
                    html_source += '<li><b>Device ID:</b> '+ res.data[t]['id'] +'</li>';
                    html_source += '<li><b>Device Name:</b> '+ res.data[t]['name'] +'</li>';
                    html_source += '<li><b>Device Type:</b> '+ res.data[t]['type'] +'</li>';
                    html_source += '<li><b>Device Object:</b> '+ res.data[t]['object'] +'</li>';
                    html_source += '<li><b>Device Parent Object:</b> '+ res.data[t]['parent_object'] +'</li>';
                    html_source += '<li><b>Device Identifier:</b> '+ res.data[t]['identifier'] +'</li>';
                }

                html_source += '</ul>';

                $("#index-page-content").html("");
                $("#index-page-content").html(html_source);

                console.log($("#index-page-content"));
            } else {
                //console.log();
            }
        break;
        /*
		case 'get_user_auth_data':
			var uTypes = new Array();
			uTypes[0] = 'quest';
			uTypes[1] = 'admin';
			uTypes[2] = 'user';
			if(res.user_logined==1) {
				var ur = res.user_role_id;
			}else {
            	var ur = 0;
			}
			var k = 1;
			var hide_all = $(".menu");
			hide_all.css("display", "none");
			for(var t=0; t!=7; t++) {
				var menu = $("#menu-"+k+"-"+uTypes[ur]);
				menu.css("display", "block");
				k++;
			}
			var k2 = 1;
			for(var t2=0; t2!=6; t2++) {
				if(res.spy_mode_on!=="0" && res.spy_mode_on!==0) {
					if(k2==3) {
                    	k2 = 4;
					}else {
						k2 = k2;
					}
					var chbx = $(".spy_mode_on-"+k2);
                	chbx.attr("checked", true);
					chbx[0].checked = "true";
				}else {
					if(k2==3) {
                    	k2 = 4;
					}else {
						k2 = k2;
					}
                	$(".spy_mode_on-"+k2).removeAttr("checked");
				}
				k2++;
			}
            var k3 = 1;
			for(var t3=0; t3!=6; t3++) {
				if(res.push_notice_on!=="0" && res.push_notice_on!==0) {
					if(k3==3) {
                    	k3 = 4;
					}else {
						k3 = k3;
					}
					var chbx2 = $(".push_notice_on-"+k3);
                	chbx2.attr("checked", true);
					chbx2[0].checked = "true";

                    var chbx3 = $(".push_notice_adm_on-"+k3);
                	chbx3.attr("checked", true);
					chbx3[0].checked = "true";
				}else {
					if(k3==3) {
                    	k3 = 4;
					}else {
						k3 = k3;
					}
                	$(".push_notice_on-"+k3).removeAttr("checked");
                	$(".push_notice_adm_on-"+k3).removeAttr("checked");
				}
				k3++;
			}
			if(ur==1) {
				$("* #last-edit-field-block1").css("width", "48%");
				$("* #last-edit-field-block1").css("float", "left");
				$("* #last-edit-field-block1").css("margin-right", "10px");
				$("* #edit-app-saler-mail").attr("class", "fifty_width");

				$("* #last-edit-field-block2").css("width", "47%");
				$("* #last-edit-field-block2").css("float", "left");

				$("* #edit-app-saler-phone").attr("class", "fifty_width");
				$("* #edit-app-saler-phone-label").css("display", "block");
				$("* #edit-app-saler-phone").css("display", "block");
				$("* #last-clr2").css("display", "none");


				$("* #last-add-field-block1").css("width", "48%");
				$("* #last-add-field-block1").css("float", "left");
				$("* #last-add-field-block1").css("margin-right", "10px");
				$("* #add-app-saler-mail").attr("class", "fifty_width");

				$("* #last-add-field-block2").css("width", "47%");
				$("* #last-add-field-block2").css("float", "left");

				$("* #add-app-saler-phone").attr("class", "fifty_width");
				$("* #add-app-saler-phone-label").css("display", "block");
				$("* #add-app-saler-phone").css("display", "block");
				$("* #last-clr2").css("display", "none");
				$("* #add-app-saler-phone").attr("value", res.user_phone_num);
                var add_app_form = $("* #add_app_form");
				add_app_form[0][12].value = res.user_phone_num;

				$("* #edit-app-saler-phone").attr("display", "block");
				$("* #edit-app-saler-phone-label").css("display", "block");
				$("* #last-edit-field-block2").css("display", "block");
			}else {

				$("* #last-add-field-block1").css("width", "100%");
                $("* #add-app-saler-mail").attr("class", "full_width");

                var add_app_form = $("* #add_app_form");
				add_app_form[0][12].value = res.user_phone_num;

				$("* #edit-app-saler-phone").attr("display", "none");
				$("* #edit-app-saler-phone-label").css("display", "none");
				$("* #last-edit-field-block2").css("display", "none");

				$("* #add-app-saler-phone-label").css("display", "none");
				$("* #add-app-saler-phone").css("display", "none");
				$("* #add-app-saler-phone").attr("value", res.user_phone_num);
			}
		break;
		case 'spy_mode_on':
			$("#index-page").click();
		break;
        case 'push_notice_on':
			$("#index-page").click();
		break;
		case 'user_confirm_code':
			if(res.operation_state==2) {
				document.getElementById("user_sms_code").value = "";
				document.getElementById("user_sms_code").style.border = "solid 1px red";
			}else {
                window.localStorage["acc_sessionID"] = res.acc_sessionID;
				window.localStorage["acc_phoneNum"] = res.user_phone_num;
				window.localStorage.removeItem("new_user_phone");
				$("#index-page").click();
			}
		break;
		case 'get_my_phone_num':
			$("* input#user_phone_num").attr("value", "");
			$("* input#user_phone_num").attr("value", res.my_phone_num);
		break;
		case 'my_profile_form_save':
			window.localStorage.removeItem("acc_phoneNum");
			window.localStorage["acc_phoneNum"] = res.my_phone_num;
	        getProfileDataFromServer();
			alert("Данные сохранены");
			$("#index-page").click();
		break;
		case 'get_my_app_list':
			var html_source = '';
            for(var i=0; i!=res[0].length; i++) {
				html_source += '<div class="app-list-item-block"><a href="#edit-app-page" onclick="edit_app('+res[0][i].appID+')"><div class="app-list-item"><img src="'+res[0][i].main_img+'" /><!--<div class="app-title-block">--><span class="ops-block2">'+res[0][i].name+'</span><span class="ops-block">'+res[0][i].os+'</span><!--</div>--><span class="app-desc-block">'+res[0][i].desc+'<div class="app-price-block"><span class="sale-perc-block"><span class="y-text">'+res[0][i].percent+'%</span> к продаже</span><span class="sale-perc-block-2"><span class="y-text"><b>'+res[0][i].price+'</b></span> <span class="rub">&#8399;</span></span></div></span></div></a></div>';
            }
			$("#app-content-my-apps-page").html("");
			$("#app-content-my-apps-page").html(html_source);
		break;
		case 'add_app':
            if(res.operation_state==1) {
				screensList = '';
				sc = 1;
				alert("Ваше приложение будет добавлено после модерации");
            }else {

            }
            $("#index-page").click();
		break;
		case 'delete_app':
			$("#index-page").click();
		break;
		case 'get_edit_data_app':
			var edit_form_obj = $("#edit_app_form");
			$("* #last-edit-field-block1").css("width", "100%");
            $("* #edit-app-saler-mail").attr("class", "full_width");
            $("* #edit-app-saler-phone").attr("value", res.saler_phone_num);

            var add_app_form2 = $("* #edit_app_form");
			add_app_form2[0][12].value = res.saler_phone_num;

            edit_form_obj[0][0].value = res.app_name;
            edit_form_obj[0][1].value = res.app_desc;
            edit_form_obj[0][2].value = res.add_google_date;
            edit_form_obj[0][3].value = res.link_in_google;
			if(res.and_ios==1) {
				edit_form_obj[0][4].checked = true;
	            edit_form_obj[0][5].value = res.add_as_date;
				edit_form_obj[0][5].style.display = 'block';
	            $("* #edit-store-lbl-1").css("display", "block");

	            edit_form_obj[0][6].value = res.link_in_as;
				edit_form_obj[0][6].style.display = 'block';
	            $("* #edit-store-lbl-2").css("display", "block");
			}else {
				edit_form_obj[0][4].checked = false;
	            edit_form_obj[0][5].value = '';
				edit_form_obj[0][5].style.display = 'none';
	            $("* #edit-store-lbl-1").css("display", "none");

	            edit_form_obj[0][6].value = '';
				edit_form_obj[0][6].style.display = 'none';
	            $("* #edit-store-lbl-2").css("display", "none");
			}
            edit_form_obj[0][7].value = res.app_price;
            edit_form_obj[0][8].value = res.sale_percent;
            edit_form_obj[0][9].value = res.saler_name;
            edit_form_obj[0][10].value = res.saler_city;
            edit_form_obj[0][11].value = res.saler_email;

            edit_form_obj[0][13].value = res.id;
			$("* #swiper-container-333").remove();
			$("* #app-content-edit-app-page #edit_app_form #swiper-container-3").append('<div class="swiper-container" id="swiper-container-333"></div>');
			$("* #swiper-container-333").html('<div class="swiper-wrapper" id="swiper-wrapper-3"></div>');
			$("* #swiper-wrapper-3").css("transform", "translate3d(0px, 0px, 0px)");
			$("* #swiper-wrapper-3").html(res.edit_screens);
			var vWidth = $("* #swiper-wrapper-3")[0].childElementCount * 76;
			var per_slides = $("* #swiper-wrapper-3")[0].childElementCount;
			if($("* .ui-mobile-viewport")[0].offsetWidth<320) {
				if(vWidth>135) {
					var per_slides = 2;
					vWidth =  76*per_slides;
				}
			}else if($("* .ui-mobile-viewport")[0].offsetWidth>320 && $("* .ui-mobile-viewport")[0].offsetWidth<375) {
				if(vWidth>170) {
					var per_slides = 2;
					vWidth =  76*per_slides;
				}
			}else if($("* .ui-mobile-viewport")[0].offsetWidth>375 && $("* .ui-mobile-viewport")[0].offsetWidth<=460) {
			if(vWidth>235) {
				var per_slides = 3;
				vWidth =  76*per_slides;
			}
			}else if($("* .ui-mobile-viewport")[0].offsetWidth>460) {
				if(vWidth>323) {
					var per_slides = 4;
					vWidth =  76*per_slides;
				}
			}
            $("* #swiper-container-3").css("display", "block");
			$("* #swiper-container-333").css("width", vWidth);
			$("* #swiper-container-333").css("max-width", vWidth);
			$("* #swiper-wrapper-3").css("width", vWidth);
			$("* #swiper-wrapper-3").css("max-width", vWidth);
			var swiper4 = '';
            swiper4 = new Swiper('#swiper-container-333', {
				width: vWidth,
				slidesPerView: per_slides,
				updateOnImagesReady: true,
				watchActiveIndex: true,
				resizeReInit: true
			});
			sc2 = $("* #swiper-wrapper-3")[0].childElementCount;
			ajax("get_user_auth_data");
		break;
		case 'edit_app':
			sc2 = 1;
			$("#index-page").click();
		break;
		case 'get_app_ditail_data':
        	$("* #ditail_main_img").html('<img src="'+res[0][0].main_img+'" />');
        	$("* #ditail_app_price").html(res[0][0].price);
        	$("* #ditail_app_percent").html(res[0][0].percent);
        	$("* #os-txt").html(res[0][0].os);
        	$("* #detail-app-name").html(res[0][0].name);
        	$("* #detail-app-desc").html(res[0][0].desc);
        	$("* #detail-app-gpm-date").html(res[0][0].gpm_date);
        	$("* #gpm-link").attr("href", res[0][0].gpm_link);
        	$("* #detail-app-saler-name").html(res[0][0].saler_name);
        	$("* #detail-app-saler-city").html(res[0][0].saler_city);
        	$("* #detail-app-saler-mail").html('<a href="mailto:'+res[0][0].saler_mail+'">'+res[0][0].saler_mail+'</a>');
        	$("* #detail-app-saler-phone").html('<a href="tel:'+res[0][0].saler_phone+'">'+res[0][0].saler_phone+'</a>');

			$("* #swiper-container-1").remove();
			$("* .ditail-app-desc-block").append('<div class="swiper-container" id="swiper-container-1"></div>');
			$("* #swiper-container-1").html('<div class="swiper-wrapper" id="swiper-wrapper-1"></div>');
			$("* #swiper-wrapper-1").css("transform", "translate3d(0px, 0px, 0px)");
	       	$("* #swiper-wrapper-1").html(res[0][0].screens);

            var slWidth = $("* .ui-mobile-viewport")[0].offsetWidth/2;
			var slWidth2 = slWidth*2;
			var swiper48 = '';
			swiper48 = new Swiper('* #swiper-container-1', {
				width: slWidth2,
				slidesPerView: 2,
				updateOnImagesReady: true,
				watchActiveIndex: true,
				resizeReInit: true
			});
			$("* #swiper-container-14").remove();
			$("* .ditail-app-desc-block").append('<div class="swiper-container" id="swiper-container-14" style="display:none;"></div>');
			$("* #swiper-container-14").html('<div class="swiper-wrapper" id="swiper-wrapper-14"></div>');
	       	$("* #swiper-wrapper-14").html(res[0][0].screens);
		break;
		case 'update_server_session':

		break;
		case 'forrget_user_pass':
			if(res.operation_state==0) {
            	document.getElementById("user_phone_num").style.border = "solid 1px red";
			}else {
            	document.getElementById("user_phone_num").style.border = "none";
			}
		break;
        */
	}
}

function ajax(g, oid) {
	var xmlhttp = getXmlHttp();
	var randomNum = Math.round((Math.random() * (40000 - 1) + 1));

	/*
	if(undefined!==window.localStorage["acc_sessionID"] && null!==window.localStorage["acc_sessionID"] && window.localStorage["acc_sessionID"]!=="") {
		var app_ex_run_id = window.localStorage["acc_sessionID"];
	}else {
		var app_ex_run_id = 0;
	}
*/

	if(g == "auth_user") {
		var user_phone_num = +document.getElementById("user_phone_num").value;
		var user_enter_pass = document.getElementById("user_pass").value;
        xmlhttp.open('GET', 'http://dev.hashing24.sale/mobile_ajax_files/test.php?operation='+g+'&eri='+app_ex_run_id+'&upn='+user_phone_num+'&uep='+user_enter_pass+'&rndtik='+randomNum, true);
	} else if (g == "get_devices_list") {
        xmlhttp.open('GET', 'http://dev.hashing24.sale/main/getDevices', true);
	} else {
        //xmlhttp.open('GET', 'http://super.aspen.ru/mobile_ajax_files/test.php?operation='+g+'&eri='+app_ex_run_id+'&rndtik='+randomNum, true);
	}

	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
	if(document.getElementById("user_phone_num").value!="" && document.getElementById("user_pass").value!="") {
		document.getElementById("user_phone_num").style.border = "none";
		document.getElementById("user_pass").style.border = "none";
		ajax("auth_user");
	}else {
		if(document.getElementById("user_phone_num").value=="") {
			document.getElementById("user_phone_num").style.border = "solid 1px red";
		}else {
			document.getElementById("user_phone_num").style.border = "none";
		}
		if(document.getElementById("user_pass").value=="") {
			document.getElementById("user_pass").style.border = "solid 1px red";
		}else {
			document.getElementById("user_pass").style.border = "none";
		}
	}
}


function forrget_user_pass() {
	if(document.getElementById("user_phone_num").value!="") {
		document.getElementById("user_phone_num").style.border = "none";
		ajax("forrget_user_pass");
	}else {
		document.getElementById("user_phone_num").style.border = "solid 1px red";
	}
}
