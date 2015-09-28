/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-09-06 13:27:24
* @Last Modified by: eslam
* @Last Modified time: 2015-09-28 11:42:14
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var stat = GetDataValue('stat');
var connected;
if (stat == 'sell') {
	document.body.innerHTML = document.body.innerHTML.replace(/{{title}}/g, '\u0627\u0644\u0645\u0639\u0627\u0631\u0636');
} else if (stat == 'service') {
	document.body.innerHTML = document.body.innerHTML.replace(/{{title}}/g, '\u0645\u0631\u0627\u0643\u0632 \u0627\u0644\u062e\u062f\u0645\u0629');
} else {
	window.location = "index.html";
}
var sellerTemp = '{{swiper}}<div class="mdl-grid rtl color-main"><h5 class="color-accent details-title-h5">معلومات عن المعرض</h5><p class="details-data-block">{{description}}</p><h5 class="color-accent details-title-h5">الفروع</h5>{{branches}}</div>',
	centersTemp = '<img class="details-img center-horizontal" src="http://192.168.1.2/cars/{{image}}"><div class="mdl-grid rtl color-main"><table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp details-data-block"><tbody><tr><td>{{branchname}}</td><td>{{branchaddress}}</td></tr><tr><td>التليفون</td><td>{{branchphone}}</td></tr><tr><td>مواعيد العمل</td><td>{{workinghours}}</td></tr><tr><td>فاكس</td><td>{{branchfax}}</td></tr></tbody></table></div>',
	sellerBranch = '<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp details-data-block"><tbody><tr><td>اسم الفرع</td><td>{{branchname}}</td></tr><tr><td>عنوان الفرع</td><td>{{branchaddress}}</td></tr><tr><td>التليفون</td><td>{{branchphone}}</td></tr></tbody></table>';
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		if (stat == 'sell') {
			loadSeller();
		} else if (stat == 'service') {
			loadCenter();
		}
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
	}
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
	window.history.back();
}
function checkConnection() {
	var networkState = navigator.connection.type;
	if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
		connected = 0;
	} else {
		connected = 1;
	}
}
function loadSeller() {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.2/cars/sellers/m_model_sellers/' + GetDataValue('id'),
		dataType : 'JSON'
	}).done(function(response) {
		sellerTemp = sellerTemp.replace(/{{description}}/g, response.seller_data[0].notes);
		var branches = '';
		for (var i = 0; i < response.seller_data[0].branches.length; i++) {
			branches += sellerBranch.replace(/{{branchname}}/g, response.seller_data[0].branches[i].branchname).replace(/{{branchaddress}}/g, response.seller_data[0].branches[i].branchaddress).replace(/{{branchphone}}/g, response.seller_data[0].branches[i].branchtel);
		}
		sellerTemp = sellerTemp.replace(/{{branches}}/g, branches);
		if (response.album_img.length > 0) {
			var swiper = '<div class="swiper-container swiper-container-main swiper-gallery-seller" dir="rtl"><div class="swiper-wrapper">';
			for (var i = 0; i < response.album_img.length; i++) {
				swiper += '<div class="swiper-slide"><img class="details-img center-horizontal" src="http://192.168.1.2/cars/' + response.album_img[i] + '"></div>';
			}
			swiper += '</div><div class="swiper-pagination swiper-pagination-shops"></div></div><br>';
			sellerTemp = sellerTemp.replace(/{{swiper}}/g, swiper);
			$('#sellers-div').html(sellerTemp);
			new Swiper('.swiper-gallery-seller', {
				pagination: '.swiper-pagination',
				slidesPerView: 1,
				paginationClickable: true,
				loop: true
			});
		} else {
			sellerTemp = sellerTemp.replace(/{{swiper}}/g, '');
			$('#sellers-div').html(sellerTemp);
		}
		$('#sellers-div').show();
		$('#loading').hide();
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل البيانات برجاء المحاولة مرة آخرى", 'إغلاق');
	});
}
function loadCenter() {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.2/cars/service_center/m_brand_center/' + GetDataValue('id'),
		dataType : 'JSON'
	}).done(function(response) {
		$('#centers-div').html(centersTemp.replace(/{{image}}/g, response[0].center_logo).replace(/{{branchname}}/g, response[0].name).replace(/{{branchaddress}}/g, response[0].address).replace(/{{branchphone}}/g, response[0].tel).replace(/{{workinghours}}/g, response[0].hours_of_work).replace(/{{branchfax}}/g, response[0].fax));
		$('#centers-div').show();
		$('#loading').hide();
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل البيانات برجاء المحاولة مرة آخرى", 'إغلاق');
	});
}