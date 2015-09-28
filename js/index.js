/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-08-26 09:59:35
* @Last Modified by: eslam
* @Last Modified time: 2015-09-28 11:40:45
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var sliderLink = 'http://192.168.1.2/cars/newcars/getslider',
	newLink = 'http://192.168.1.2/cars/newcars/get_new_recent?page=0',
	usedLink = 'http://192.168.1.2/cars/used/get_used_recent?page=0';
var slidTemp = '<div class="swiper-slide"><a href="details.html?stat=main&link={{link}}&type={{type}}"><img class="details-img center-horizontal" src="http://192.168.1.2/cars/{{carimage}}"><h5 class="rtl reports-image-title mainSlider-title">{{title}}</h5></a></div>',
	newTemp = '<div class="swiper-slide"><a href="details.html?stat=new&brand={{brand}}&model={{model}}"><img class="main-img" src="http://192.168.1.2/cars/{{carimage}}"><div class="main-title rtl float-right"><h5 class="main-title-h5 float-right color-main main-title-content">{{cartitle}}</h5><span class="main-title-price color-accent main-title-content">{{carprice}}</span></div></a></div>',
	usedTemp = '<div class="swiper-slide"><a href="details.html?stat=used&id={{id}}"><img class="main-img" src="http://192.168.1.2/cars/{{carimage}}"><div class="main-title rtl float-right"><h5 class="main-title-h5 float-right color-main main-title-content">{{cartitle}}</h5><span class="main-title-price color-accent main-title-content">{{carprice}}</span></div></a></div>';
var connected;
var loadedSlider = false, loadedNewCars = false, loadedOldCars = false;
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadSlider();
		loadNewCars();
		loadOldCars();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		loadSliderOffline();
		loadNewCarsOffline();
		loadOldCarsOffline();
	}
}
function onBackKeyDown() {
	navigator.app.exitApp();
}
function checkConnection() {
	var networkState = navigator.connection.type;
	if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
		connected = 0;
	} else {
		connected = 1;
	}
}
function loadSlider() {
	$.ajax({
		type : 'GET',
		url : sliderLink,
		dataType : 'JSON'
	}).done(function(response) {
		window.localStorage.setItem('savedSlider', JSON.stringify(response));
		fillSlider(response);
	}).fail(function() {
		loadedSlider = true;
		if (loadedSlider && loadedNewCars && loadedOldCars) {
			$('#loading').hide();
		}
		createSnackbar("حدث خطأ اثناء تحميل بيانات السيارات برجاء المحاولة مرة آخرى", 'إغلاق');
		loadSliderOffline();
	});
}
function loadNewCars() {
	$.ajax({
		type : 'GET',
		url : newLink,
		dataType : 'JSON'
	}).done(function(response) {
		window.localStorage.setItem('savedNew', JSON.stringify(response));
		fillNew(response);
	}).fail(function() {
		loadedNewCars = true;
		if (loadedSlider && loadedNewCars && loadedOldCars) {
			$('#loading').hide();
		}
		createSnackbar("حدث خطأ اثناء تحميل بيانات السيارات الجديدة برجاء المحاولة مرة آخرى", 'إغلاق');
		loadNewCarsOffline();
	});
}
function loadOldCars() {
	$.ajax({
		type : 'GET',
		url : usedLink,
		dataType : 'JSON'
	}).done(function(response) {
		window.localStorage.setItem('savedUsed', JSON.stringify(response));
		fillUsed(response);
	}).fail(function() {
		loadedOldCars = true;
		if (loadedSlider && loadedNewCars && loadedOldCars) {
			$('#loading').hide();
		}
		createSnackbar("حدث خطأ اثناء تحميل بيانات السيارات المستعملة برجاء المحاولة مرة آخرى", 'إغلاق');
		loadOldCarsOffline();
	});
}
function loadSliderOffline() {
	var savedSlider = window.localStorage.getItem('savedSlider');
	if (!(typeof savedSlider === 'undefined' || savedSlider === null)) {
	    fillSlider(JSON.parse(savedSlider));
	}
}
function loadNewCarsOffline() {
	var savedNew = window.localStorage.getItem('savedNew');
	if (!(typeof savedNew === 'undefined' || savedNew === null)) {
	    fillNew(JSON.parse(savedNew));
	}
}
function loadOldCarsOffline() {
	var savedUsed = window.localStorage.getItem('savedUsed');
	if (!(typeof savedUsed === 'undefined' || savedUsed === null)) {
	    fillUsed(JSON.parse(savedUsed));
	}
}
function fillSlider(response) {
	for (var i = 0; i < response.length; i++) {
		$('#slider').append(slidTemp.replace(/{{link}}/g, response[i].link).replace(/{{type}}/g, response[i].type).replace(/{{carimage}}/g, response[i].img_path).replace(/{{title}}/g, response[i].title));
	}
	new Swiper('.swiper-container-main', {
		pagination: '.swiper-pagination',
		slidesPerView: 1,
		paginationClickable: true,
		loop: true
	});
	//$('.swiper-pagination').css('bottom', $('.mainSlider-title').height() + ($('.swiper-container-main').height() * 0.02));
	loadedSlider = true;
	if (loadedSlider && loadedNewCars && loadedOldCars) {
		$('#loading').hide();
	}
}
function fillNew(response) {
	for (var i = 0; i < response.details.length; i++) {
		$('#newCars').append(newTemp.replace(/{{brand}}/g, response.details[i].brand).replace(/{{model}}/g, response.details[i].model_id).replace(/{{carimage}}/g, response.details[i].images).replace(/{{cartitle}}/g, response.details[i].model_name).replace(/{{carprice}}/g, response.details[i].price + ' ج'));
	}
	new Swiper('.swiper-container-new', {
        slidesPerView: 2,
        spaceBetween: 8,
        loop: true,
        autoplay: 2000
    });
	loadedNewCars = true;
	if (loadedSlider && loadedNewCars && loadedOldCars) {
		$('#loading').hide();
	}
}
function fillUsed(response) {
	for (var i = 0; i < response.details.length; i++) {
		$('#usedCars').append(usedTemp.replace(/{{id}}/g, response.details[i].id).replace(/{{carimage}}/g, response.details[i].images).replace(/{{cartitle}}/g, response.details[i].model_name).replace(/{{carprice}}/g, response.details[i].price + ' ج'));
	}
	new Swiper('.swiper-container-used', {
        slidesPerView: 2,
        spaceBetween: 8,
        loop: true,
        autoplay: 2000
    });
	loadedOldCars = true;
	if (loadedSlider && loadedNewCars && loadedOldCars) {
		$('#loading').hide();
	}
}