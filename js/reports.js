/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-08-26 14:11:12
* @Last Modified by: eslam
* @Last Modified time: 2015-09-03 12:35:01
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var reportsLink = 'http://192.168.1.2/cars/category/show_list_mobile/3/';
var page = 0;
var connected;
var temp = '<div class="half position-relative float-right"><a href="details.html?stat=report&id={{id}}"><img class="main-img" src="http://192.168.1.2/cars/images/news/{{image}}"><h5 class="rtl reports-image-title">{{title}}</h5></a></div>';
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadData();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		loadDataOffline();
	}
	$('#reports-show-more').click(function() {
		checkConnection();
		if (connected == 1) {
			$('#loading').show();
			loadData();
		} else {
			createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		}
	});
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
		url : reportsLink + page,
		dataType : 'JSON'
	}).done(function(response) {
		if (page == 0) {
			window.localStorage.setItem('savedReports', JSON.stringify(response));
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
	var data = window.localStorage.getItem('savedReports');
	if (!(typeof data === 'undefined' || data === null)) {
	    fillData(JSON.parse(data));
	}
}
function fillData(response) {
	for (var i = 0; i < response.length; i++) {
		$('#maindata').append(temp.replace(/{{id}}/g, response[i].id).replace(/{{title}}/g, response[i].title).replace(/{{image}}/g, response[i].images));
	}
}