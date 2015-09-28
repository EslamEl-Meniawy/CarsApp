/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-08-26 15:50:09
* @Last Modified by: eslam
* @Last Modified time: 2015-09-03 15:47:14
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var stat = GetDataValue('stat');
var connected;
if (stat == 'new') {
	document.body.innerHTML = document.body.innerHTML.replace(/{{title}}/g, '\u0633\u064a\u0627\u0631\u0627\u062a \u062c\u062f\u064a\u062f\u0629');
} else if (stat == 'used') {
	document.body.innerHTML = document.body.innerHTML.replace(/{{title}}/g, '\u0633\u064a\u0627\u0631\u0627\u062a \u0645\u0633\u062a\u0639\u0645\u0644\u0629');
} else if (stat == 'report') {
	document.body.innerHTML = document.body.innerHTML.replace(/{{title}}/g, '\u062a\u0642\u0627\u0631\u064a\u0631');
} else if (stat == 'main') {
	document.body.innerHTML = document.body.innerHTML.replace(/{{title}}/g, '\u0633\u064a\u0627\u0631\u0627\u062a');
} else {
	window.location = "index.html";
}
var newTemp = '<div class="mdl-shadow--2dp details-title-block"><div class="mdl-grid"><span class="color-accent mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">{{modelname}}</span><div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--2-col-phone"><img class="main-img" src="http://192.168.1.2/cars/{{image}}"></div><div class="mdl-cell mdl-cell--7-col mdl-cell--5-col-tablet mdl-cell--2-col-phone"><h6 class="color-accent details-title-h5">السعر</h6><div><span>5000</span><span class="main-block-header-title">قسط شهرى</span></div><div><span>{{price}}</span><span class="main-block-header-title">كاش</span></div></div><table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp details-data-block"><tbody><tr><td>ناقل الحركه</td><td>{{transmission}}</td></tr><tr><td>النمط </td><td>{{style}}</td></tr><tr><td>السعه</td><td>{{capacity}} سي سي</td></tr><tr><td>وسائد هوائية</td><td>{{bags}}</td></tr><tr><td>نظام فرامل ABS</td><td>{{abs}}</td></tr><tr><td>مقاس الجنط</td><td>{{rim}}</td></tr><tr><td>فوانيس ضباب</td><td>{{fog}}</td></tr></tbody></table></div></div><br>',
	usedTemp = '<h5 class="color-accent details-title-h5">الوصف</h5><p>{{cardiscription}}</p><br>{{swiper}}<h5 class="color-accent details-title-h5">المواصفات</h5><table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp details-data-block"><tbody><tr><td>النمط</td><td>{{style}}</td></tr><tr><td>سعه المحرك </td><td>{{capacity}} سى سى</td></tr><tr><td>سنه الصنع</td><td>{{year}}</td></tr><tr><td>كيلومترات</td><td>{{km}} كم</td></tr><tr><td>ناقل الحركه</td><td>{{transimition}}</td></tr><tr><td>عدد الابواب</td><td>{{doors}} باب</td></tr><tr><td>تكييف الهواء</td><td>{{aircondition}}</td></tr><tr><td>زجاج كهربائى</td><td>{{glass}}</td></tr><tr><td>سنتر لوك</td><td>{{center}}</td></tr><tr><td>أنذار</td><td>{{alarm}}</td></tr><tr><td>وسائد هوائية</td><td>{{bags}}</td></tr><tr><td>فتحة سقف</td><td>{{seal}}</td></tr><tr><td>مثبت سرعة</td><td>{{speedlimiter}}</td></tr><tr><td>راديو كاست</td><td>{{radio}}</td></tr><tr><td>نظام فرامل ABS</td><td>{{abs}}</td></tr><tr><td>توزيع اليكتروني للفرامل EBD</td><td>{{ebd}}</td></tr></tbody></table><br><div class="mdl-shadow--2dp details-title-block float-right drawer-div-center"><span>السعر: </span><span class="color-accent">{{price}}</span><span> جنيه مصرى</span></div><br><br><h5 class="color-accent details-title-h5">بيانات المالك</h5><table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp details-data-block"><tbody><tr><td>العنوان</td><td>{{region}} - {{governorate}}</td></tr><tr><td>البريد الإلكتروني</td><td>{{mail}}</td></tr><tr><td>رقم الهاتف</td><td>{{phone}}</td></tr></tbody></table>';
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		if (stat == 'new') {
			loadNew();
		} else if (stat == 'used') {
			loadUsed();
		} else if (stat == 'report') {
			loadReports();
		} else if (stat == 'main') {
			loadMain();
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
function loadMain() {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.2/cars/' + GetDataValue('link') + '?mobile=m',
		dataType : 'JSON'
	}).done(function(response) {
		if (GetDataValue('type') == 'newcars') {
			fillNew(response);
		} else if (GetDataValue('type') == 'report') {
			fillReports(response);
		} else {
			window.location = "index.html";
		}
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل البيانات برجاء المحاولة مرة آخرى", 'إغلاق');
	});
}
function loadNew() {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.2/cars/newcars/modelengines/' + GetDataValue('brand') + '/' + GetDataValue('model') + '?mobile=mobile',
		dataType : 'JSON'
	}).done(function(response) {
		fillNew(response);
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل البيانات برجاء المحاولة مرة آخرى", 'إغلاق');
	});
}
function loadUsed() {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.2/cars/used/m_page/' + GetDataValue('id'),
		dataType : 'JSON'
	}).done(function(response) {
		$('#main-title').html(response.content[0].brand_name + ' ' + response.content[0].model_name);
		$('#main-image').attr('src', 'http://192.168.1.2/cars/' + response.content[0].car_image);
		usedTemp = usedTemp.replace(/{{cardiscription}}/g, response.content[0].additional_info).replace(/{{style}}/g, response.content[0].style).replace(/{{capacity}}/g, response.content[0].engine_capacity).replace(/{{year}}/g, response.content[0].year).replace(/{{km}}/g, response.content[0].km).replace(/{{transimition}}/g, response.content[0].transmission).replace(/{{doors}}/g, response.content[0].doors).replace(/{{aircondition}}/g, response.content[0].air_conditioning).replace(/{{glass}}/g, response.content[0].electric_glass).replace(/{{center}}/g, response.content[0].center_lock).replace(/{{alarm}}/g, response.content[0].alarm).replace(/{{bags}}/g, response.content[0].bags).replace(/{{seal}}/g, response.content[0].sunroof).replace(/{{speedlimiter}}/g, response.content[0].speed_control).replace(/{{radio}}/g, response.content[0].cassette).replace(/{{abs}}/g, response.content[0].abs_brake).replace(/{{ebd}}/g, response.content[0].brake_abd).replace(/{{price}}/g, response.content[0].price).replace(/{{region}}/g, response.regions[0].region).replace(/{{governorate}}/g, response.regions[0].government).replace(/{{mail}}/g, response.content[0].user_email).replace(/{{phone}}/g, response.content[0].user_telephone);
		if (response.images.length > 0) {
			var swiper = '<div class="swiper-container swiper-container-main swiper-used" dir="rtl"><div class="swiper-wrapper">';
			for (var i = 0; i < response.images.length; i++) {
				swiper += '<div class="swiper-slide"><img class="details-img center-horizontal" src="http://192.168.1.2/cars/' + response.images[i] + '"></div>';
			}
			swiper += '</div></div><br>';
			usedTemp = usedTemp.replace(/{{swiper}}/g, swiper);
			$('#stat-used').html(usedTemp);
			new Swiper('.swiper-used', {
				slidesPerView: 1,
				loop: true,
				autoplay: 2000
			});
		} else {
			usedTemp = usedTemp.replace(/{{swiper}}/g, '');
			$('#stat-used').html(usedTemp);
		}
		$('#stat-used').show();
		$('#loading').hide();
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل البيانات برجاء المحاولة مرة آخرى", 'إغلاق');
	});
}
function loadReports() {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.2/cars/category/mobile_report/' + GetDataValue('id'),
		dataType : 'JSON'
	}).done(function(response) {
		fillReports(response);
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل البيانات برجاء المحاولة مرة آخرى", 'إغلاق');
	});
}
function fillNew(response) {
	$('#main-title').html(response.model_engin[0].model_name);
	$('#main-image').attr('src', 'http://192.168.1.2/cars/' + response.model_engin[0].image);
	for (var i = 0; i < response.model_engin.length; i++) {
		$('#stat-new').append(newTemp.replace(/{{modelname}}/g, response.model_engin[i].model_engine_name).replace(/{{image}}/g, response.model_engin[i].images).replace(/{{price}}/g, response.model_engin[i].price).replace(/{{transmission}}/g, response.model_engin[i].transmission).replace(/{{style}}/g, response.model_engin[i].style).replace(/{{capacity}}/g, response.model_engin[i].engine_capacity).replace(/{{bags}}/g, response.model_engin[i].bags).replace(/{{abs}}/g, response.model_engin[i].abs_brake).replace(/{{rim}}/g, response.model_engin[i].rim_size).replace(/{{fog}}/g, response.model_engin[i].front_fog_lamps));
	}
	if (response.seller.length > 0) {
		$('#stat-new').append('<h5 class="color-accent details-title-h5">متوفرة لدي</h5><br>');
		var swiper = '<div class="swiper-container swiper-container-main swiper-new" dir="rtl"><div class="swiper-wrapper">';
		for (var i = 0; i < response.seller.length; i++) {
			swiper += '<div class="swiper-slide"><a href="#"><img class="details-img center-horizontal" src="http://192.168.1.2/cars/' + response.seller[i].logo + '"><h5 class="rtl reports-image-title">' + response.seller[i].name + '</h5></a></div>';
		}
		swiper += '</div></div><br>';
		$('#stat-new').append(swiper);
		new Swiper('.swiper-new', {
			slidesPerView: 1,
			loop: true,
			autoplay: 2000
		});
	}
	$('#stat-new').show();
	$('#loading').hide();
}
function fillReports(response) {
	$('#main-title').html(response[0].article_title);
	$('#main-image').attr('src', 'http://192.168.1.2/cars/images/news/' + response[0].images);
	$('#stat-report').html(response[0].content);
	$('#stat-report').show();
	$('#loading').hide();
}