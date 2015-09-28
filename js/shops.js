/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-09-06 11:26:03
* @Last Modified by: eslam
* @Last Modified time: 2015-09-28 11:40:59
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var stat = GetDataValue('stat');
var connected;
var page = 0;
var link;
if (stat == 'sell') {
	document.body.innerHTML = document.body.innerHTML.replace(/{{title}}/g, '\u0627\u0644\u0645\u0639\u0627\u0631\u0636');
	link = 'http://192.168.1.2/cars/sellers/m_allSeller?page=';
} else if (stat == 'service') {
	document.body.innerHTML = document.body.innerHTML.replace(/{{title}}/g, '\u0645\u0631\u0627\u0643\u0632 \u0627\u0644\u062e\u062f\u0645\u0629');
	link = 'http://192.168.1.2/cars/service_center/m_allCenters?page=';
} else {
	window.location = "index.html";
}
var temp = '<div class="mdl-cell grid-50"><a class="no-decoration" href="shopsdetails.html?stat={{stat}}&id={{id}}"><img class="main-img" src="http://192.168.1.2/cars/{{image}}"><div class="background-grey"><h6 class="main-block-header-title color-dark">{{name}}</h6></div></a></div>';
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadData();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		loadDataOffline();
	}
	$('#shops-show-more').click(function() {
		checkConnection();
		if (connected == 1) {
			$('#loading').show();
			loadData();
		} else {
			createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		}
	});
}
function GetDataValue(VarSearch) {
	var SearchString = window.location.search.substring(1);
	var VariableArray = SearchString.split('&');
	for (var i = 0; i < VariableArray.length; i++) {
		var KeyValuePair = VariableArray[i].split('=');
		if (KeyValuePair[0] == VarSearch) {
			return KeyValuePair[1];
		}
	}
}
function onBackKeyDown() {
	window.location = "index.html";
}
function checkConnection() {
	var networkState = navigator.connection.type;
	if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
		connected = 0;
	} else {
		connected = 1;
	}
}
function loadData() {
	$.ajax({
		type : 'GET',
		url : link + page,
		dataType : 'JSON'
	}).done(function(response) {
		if (page == 0) {
			if (stat == 'sell') {
				window.localStorage.setItem('savedSeller', JSON.stringify(response));
			} else if (stat == 'service') {
				window.localStorage.setItem('savedCenters', JSON.stringify(response));
			}
		}
		fillData(response);
		page ++;
		$('#loading').hide();
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل بيانات السيارات برجاء المحاولة مرة آخرى", 'إغلاق');
		if (page == 0) {
			loadDataOffline();
		}
	});
}
function loadDataOffline() {
	var data;
	if (stat == 'sell') {
		data = window.localStorage.getItem('savedSeller');
	} else if (stat == 'service') {
		data = window.localStorage.getItem('savedCenters');
	}
	if (!(typeof data === 'undefined' || data === null)) {
	    fillData(JSON.parse(data));
	}
}
function fillData(response) {
	for (var i = 0; i < response.length; i++) {
		if (stat == 'sell') {
			$('#maindata').append(temp.replace(/{{stat}}/g, stat).replace(/{{id}}/g, response[i].id).replace(/{{image}}/g, response[i].seller_logo).replace(/{{name}}/g, response[i].name));
		} else if (stat == 'service') {
			$('#maindata').append(temp.replace(/{{stat}}/g, stat).replace(/{{id}}/g, response[i].id).replace(/{{image}}/g, response[i].logo).replace(/{{name}}/g, response[i].name));
		}
	}
	$('.grid-50').each(function() {
		$(this).width(((($(window).width() - 16) * 0.5) - 16) + 'px');
	});
}