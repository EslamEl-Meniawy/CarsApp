/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-08-26 12:42:46
* @Last Modified by: eslam
* @Last Modified time: 2015-09-28 11:40:52
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var page = 0;
var link;
var connected;
var stat = GetDataValue('stat');
if (stat == 'new') {
	document.body.innerHTML = document.body.innerHTML.replace(/{{title}}/g, '\u0633\u064a\u0627\u0631\u0627\u062a \u062c\u062f\u064a\u062f\u0629').replace(/{{stat}}/g, 'new');
	link = 'http://192.168.1.2/cars/newcars/get_new_recent?page=';
} else if (stat == 'used') {
	document.body.innerHTML = document.body.innerHTML.replace(/{{title}}/g, '\u0633\u064a\u0627\u0631\u0627\u062a \u0645\u0633\u062a\u0639\u0645\u0644\u0629').replace(/{{stat}}/g, 'used');
	link = 'http://192.168.1.2/cars/used/get_used_recent?page=';
} else {
	window.location = "index.html";
}
var newTemp = '<a class="no-decoration" href="details.html?stat=new&brand={{brand}}&model={{model}}"><div class="mdl-grid"><div class="mdl-cell grid-60 rtl position-relative"><h5 class="cars-title">{{cartitle}}</h5><div class="color-main">{{carcc}}</div><div class="cars-car-price color-main">{{carprice}}</div></div><div class="mdl-cell grid-40"><img class="main-img" src="http://192.168.1.2/cars/{{carimage}}"></div></div></a>',
	usedTemp = '<a class="no-decoration" href="details.html?stat=used&id={{id}}"><div class="mdl-grid"><div class="mdl-cell grid-60 rtl position-relative"><h5 class="cars-title">{{cartitle}}</h5><div class="color-main">{{carcc}}</div><div class="cars-car-price color-main">{{carprice}}</div></div><div class="mdl-cell grid-40"><img class="main-img" src="http://192.168.1.2/cars/{{carimage}}"></div></div></a>';
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
	$('#cars-show-more').click(function() {
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
	if (stat == 'new') {
		data = window.localStorage.getItem('savedNew');
	} else if (stat == 'used') {
		data = window.localStorage.getItem('savedUsed');
	}
	if (!(typeof data === 'undefined' || data === null)) {
	    fillData(JSON.parse(data));
	}
}
function fillData(response) {
	for (var i = 0; i < response.details.length; i++) {
		if (stat == 'new') {
			$('#maindata').append(newTemp.replace(/{{brand}}/g, response.details[i].brand).replace(/{{model}}/g, response.details[i].model_id).replace(/{{carimage}}/g, response.details[i].images).replace(/{{cartitle}}/g, response.details[i].model_name).replace(/{{carprice}}/g, response.details[i].price + ' ج').replace(/{{carcc}}/g, response.details[i].engine_capacity + ' سي سي'));
		} else if (stat == 'used') {
			$('#maindata').append(usedTemp.replace(/{{id}}/g, response.details[i].id).replace(/{{carimage}}/g, response.details[i].images).replace(/{{cartitle}}/g, response.details[i].model_name).replace(/{{carprice}}/g, response.details[i].price + ' ج').replace(/{{carcc}}/g, response.details[i].engine_capacity + ' سي سي'));
		}
	}
	$('.grid-60').each(function() {
		$(this).width(((($(window).width() - 16) * 0.6) - 16) + 'px');
	});
	$('.grid-40').each(function() {
		$(this).width(((($(window).width() - 16) * 0.4) - 16) + 'px');
	});
}