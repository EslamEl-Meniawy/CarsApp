/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-08-30 11:01:00
* @Last Modified by: eslam
* @Last Modified time: 2015-09-28 11:41:30
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var stat = GetDataValue('stat');
var connected;
if (stat == 'new') {
	$('#fixed-tab-2-tab').addClass('is-active');
	$('#fixed-tab-2').addClass('is-active');
} else if (stat == 'used') {
	$('#fixed-tab-1-tab').addClass('is-active');
	$('#fixed-tab-1').addClass('is-active');
} else {
	$('#fixed-tab-3-tab').addClass('is-active');
	$('#fixed-tab-3').addClass('is-active');
}
var priceMin = 100, priceMax = 300000, distanceMin = 250, distanceMax = 450, priceMinNew = 100, priceMaxNew = 300000;
var usedID = -1, newID = -1, allID = -1;
var newTemp = '<a class="no-decoration" href="details.html?stat=new&brand={{brand}}&model={{model}}"><div class="mdl-grid"><div class="mdl-cell mdl-cell--7-col mdl-cell--5-col-tablet mdl-cell--2-col-phone rtl position-relative"><h5 class="cars-title">{{cartitle}}</h5><div class="color-main">{{carcc}}</div><div class="cars-car-price color-main">{{carprice}}</div></div><div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--2-col-phone"><img class="main-img" src="http://192.168.1.2/cars/{{carimage}}"></div></div></a>',
	usedTemp = '<a class="no-decoration" href="details.html?stat=used&id={{id}}"><div class="mdl-grid"><div class="mdl-cell mdl-cell--7-col mdl-cell--5-col-tablet mdl-cell--2-col-phone rtl position-relative"><h5 class="cars-title">{{cartitle}}</h5><div class="color-main">{{carcc}}</div><div class="cars-car-price color-main">{{carprice}}</div></div><div class="mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet mdl-cell--2-col-phone"><img class="main-img" src="http://192.168.1.2/cars/{{carimage}}"></div></div></a>';
var app = angular.module('multiSlider', ['rzModule']);
app.controller('MainCtrl', function($scope) {
	$scope.priceSlider = {
		min: 100,
		max: 300000,
		ceil: 1000000,
		floor: 100
	};
	$scope.distanceSlider = {
		min: 250,
		max: 450,
		ceil: 1000,
		floor: 10
	};
	$scope.priceSliderNew = {
		min: 100,
		max: 300000,
		ceil: 1000000,
		floor: 100
	};
	$scope.onChangePrice = function() {
		priceMin = $scope.priceSlider.min;
		priceMax = $scope.priceSlider.max;
	};
	$scope.onChangeDistance = function() {
		distanceMin = $scope.distanceSlider.min;
		distanceMax = $scope.distanceSlider.max;
	};
	$scope.onChangePriceNew = function() {
		priceMinNew = $scope.priceSliderNew.min;
		priceMaxNew = $scope.priceSliderNew.max;
	};
});
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		var lastFetchModelTime = window.localStorage.getItem('lastFetchModelTime');
		if (typeof lastFetchModelTime === 'undefined' || lastFetchModelTime === null) {
			getModelFile();
		} else {
			var IntervalDiffMinutes = 5 * 60 * 1000;
			var oldDate = new Date(window.localStorage.getItem('lastFetchModelTime'));
			var newDate = new Date();
			if ((newDate - oldDate) >= IntervalDiffMinutes) {
				getModelFile();
			} else {
				completeSearch();
			}
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
	if ($('#fixed-tab-2').hasClass('is-active')) {
		if ($("#new-search-div-results .search-results-number").length) {
			$('#new-search-div').show();
			$('#new-search-div-results').html('');
			$('#new-search-div-results').hide();
		} else {
			window.history.back();
		}
	} else if ($('#fixed-tab-1').hasClass('is-active')) {
		if ($("#used-search-div-results .search-results-number").length) {
			$('#used-search-div').show();
			$('#used-search-div-results').html('');
			$('#used-search-div-results').hide();
		} else {
			window.history.back();
		}
	} else {
		if ($("#all-search-div-results .search-results-number").length) {
			$('#all-search-div').show();
			$('#all-search-div-results').html('');
			$('#all-search-div-results').hide();
		} else {
			window.history.back();
		}
	}
}
function checkConnection() {
	var networkState = navigator.connection.type;
	if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
		connected = 0;
	} else {
		connected = 1;
	}
}
function getModelFile() {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.2/cars/brand_model_autocom.php',
		dataType : 'JSON'
	}).done(function(response) {
		window.localStorage.setItem('savedModels', JSON.stringify(response));
		window.localStorage.setItem('lastFetchModelTime', new Date());
		completeSearch();
	}).fail(function() {
		createSnackbar("لا يمكن البحث الآن برجاء المحاولة مرة آخرى", 'إغلاق');
	});
}
function completeSearch() {
	$("#used-model").keyup(function() {
		if ($( this ).val().length < 3) {
			$('#used-model-error').css('visibility', 'visible');
			$('#used-suggestions').hide();
			usedID = -1;
		} else {
			$('#used-model-error').css('visibility', 'hidden');
			var models = JSON.parse(window.localStorage.getItem('savedModels'));
			var suggestions = '<ul class="mdl-menu">';
			for (var i = 0; i < models.selection.length; i++) {
				if (models.selection[i].indexOf($( this ).val()) > -1) {
					suggestions += '<li class="mdl-menu__item rtl" onClick="usedSelected(' + i + ')">' + models.selection[i] + '</li>';
				}
			}
			if (suggestions == '<ul class="mdl-menu">') {
				suggestions += '<li class="mdl-menu__item rtl" onClick="usedSelected(' + (-1) + ')">غير متوفر</li></ul>';
			} else {
				suggestions += '</ul>';
			}
			$('#used-suggestions').html(suggestions);
			$('#used-suggestions').show();
		}
	});
	$("#used-model").focusout(function() {
		if ($( this ).val().length == 0) {
			$('#used-model-error').css('visibility', 'hidden');
			$('#used-suggestions').hide();
			usedID = -1;
		}
	});
	$('#used-search').click(function() {
		var link = 'http://192.168.1.2/cars/search?mobile=mobile&page=0&search_type=used';
		if (usedID != -1) {
			link += '&mark_model=' + usedID;
		}
		link += '&price=' + priceMin + '%2C' + priceMax;
		link += '&km=' + distanceMin + '%2C' + distanceMax;
		if ($('#used-year-from').val().length > 0) {
			link += '&year=' + $('#used-year-from').val();
		}
		if ($('#used-year-to').val().length > 0) {
			link += '&year_to=' + $('#used-year-to').val();
		}
		$('#loading').show();
		$.ajax({
			type : 'GET',
			url : link,
			dataType : 'JSON'
		}).done(function(response) {
			if (response.details.length > 0) {
				var results = '<div class="mdl-shadow--2dp rtl search-results-number">تم العثور على ' + response.details.length + ' نتيجة بحث</div>';
				for (var i = 0; i < response.details.length; i++) {
					results += usedTemp.replace(/{{id}}/g, response.details[i].id).replace(/{{cartitle}}/g, response.details[i].brand_name + ' ' + response.details[i].model_name).replace(/{{carcc}}/g, response.details[i].engine_capacity + ' سي سي').replace(/{{carprice}}/g, response.details[i].price + ' ج').replace(/{{carimage}}/g, response.details[i].images);
				}
				$('#used-search-div-results').html(results);
			} else {
				$('#used-search-div-results').html('<div class="mdl-shadow--2dp rtl search-results-number">لم يتم العثور على نتائج بحث</div>');
			}
			$('#used-search-div').hide();
			$('#used-search-div-results').show();
			$('#loading').hide();
		}).fail(function() {
			$('#loading').hide();
			createSnackbar("حدث خطأ اثناء البحث برجاء المحاولة مرة آخرى", 'إغلاق');
		});
	});
	$("#new-model").keyup(function() {
		if ($( this ).val().length < 3) {
			$('#new-model-error').css('visibility', 'visible');
			$('#new-suggestions').hide();
			newID = -1;
		} else {
			$('#new-model-error').css('visibility', 'hidden');
			var models = JSON.parse(window.localStorage.getItem('savedModels'));
			var suggestions = '<ul class="mdl-menu">';
			for (var i = 0; i < models.selection.length; i++) {
				if (models.selection[i].indexOf($( this ).val()) > -1) {
					suggestions += '<li class="mdl-menu__item rtl" onClick="newSelected(' + i + ')">' + models.selection[i] + '</li>';
				}
			}
			if (suggestions == '<ul class="mdl-menu">') {
				suggestions += '<li class="mdl-menu__item rtl" onClick="newSelected(' + (-1) + ')">غير متوفر</li></ul>';
			} else {
				suggestions += '</ul>';
			}
			$('#new-suggestions').html(suggestions);
			$('#new-suggestions').show();
		}
	});
	$("#new-model").focusout(function() {
		if ($( this ).val().length == 0) {
			$('#new-model-error').css('visibility', 'hidden');
			$('#new-suggestions').hide();
			newID = -1;
		}
	});
	$('#new-search').click(function() {
		var link = 'http://192.168.1.2/cars/search?mobile=mobile&page=0&search_type=new';
		if (newID != -1) {
			link += '&mark_model=' + newID;
		}
		link += '&price=' + priceMinNew + '%2C' + priceMaxNew;
		if ($('#new-year-from').val().length > 0) {
			link += '&year=' + $('#new-year-from').val();
		}
		if ($('#new-year-to').val().length > 0) {
			link += '&year_to=' + $('#new-year-to').val();
		}
		$('#loading').show();
		$.ajax({
			type : 'GET',
			url : link,
			dataType : 'JSON'
		}).done(function(response) {
			if (response.details.length > 0) {
				var results = '<div class="mdl-shadow--2dp rtl search-results-number">تم العثور على ' + response.details.length + ' نتيجة بحث</div>';
				for (var i = 0; i < response.details.length; i++) {
					results += newTemp.replace(/{{brand}}/g, response.details[i].brand).replace(/{{model}}/g, response.details[i].model_id).replace(/{{cartitle}}/g, response.details[i].brand_name + ' ' + response.details[i].model_name).replace(/{{carcc}}/g, response.details[i].engine_capacity + ' سي سي').replace(/{{carprice}}/g, response.details[i].price + ' ج').replace(/{{carimage}}/g, response.details[i].images);
				}
				$('#new-search-div-results').html(results);
			} else {
				$('#new-search-div-results').html('<div class="mdl-shadow--2dp rtl search-results-number">لم يتم العثور على نتائج بحث</div>');
			}
			$('#new-search-div').hide();
			$('#new-search-div-results').show();
			$('#loading').hide();
		}).fail(function() {
			$('#loading').hide();
			createSnackbar("حدث خطأ اثناء البحث برجاء المحاولة مرة آخرى", 'إغلاق');
		});
	});
	$("#all-model").keyup(function() {
		if ($( this ).val().length < 3) {
			$('#all-model-error').css('visibility', 'visible');
			$('#all-suggestions').hide();
			allID = -1;
		} else {
			$('#all-model-error').css('visibility', 'hidden');
			var models = JSON.parse(window.localStorage.getItem('savedModels'));
			var suggestions = '<ul class="mdl-menu">';
			for (var i = 0; i < models.selection.length; i++) {
				if (models.selection[i].indexOf($( this ).val()) > -1) {
					suggestions += '<li class="mdl-menu__item rtl" onClick="allSelected(' + i + ')">' + models.selection[i] + '</li>';
				}
			}
			if (suggestions == '<ul class="mdl-menu">') {
				suggestions += '<li class="mdl-menu__item rtl" onClick="allSelected(' + (-1) + ')">غير متوفر</li></ul>';
			} else {
				suggestions += '</ul>';
			}
			$('#all-suggestions').html(suggestions);
			$('#all-suggestions').show();
		}
	});
	$("#all-model").focusout(function() {
		if ($( this ).val().length == 0) {
			$('#all-model-error').css('visibility', 'hidden');
			$('#all-suggestions').hide();
			allID = -1;
		}
	});
	$('#all-search').click(function() {
		var link = 'http://192.168.1.2/cars/search?mobile=mobile&page=0&search_type=all';
		if (allID != -1) {
			link += '&mark_model=' + allID;
		}
		if ($('#all-year-from').val().length > 0) {
			link += '&year=' + $('#all-year-from').val();
		}
		if ($('#all-year-to').val().length > 0) {
			link += '&year_to=' + $('#all-year-to').val();
		}
		$('#loading').show();
		$.ajax({
			type : 'GET',
			url : link,
			dataType : 'JSON'
		}).done(function(response) {
			if (response.new.length > 0 || response.used.length > 0) {
				var results = '<div class="mdl-shadow--2dp rtl search-results-number">تم العثور على<br>' + response.new.length + ' سيارة جديدة<br>' + response.used.length + ' سيارة مستعملة</div>';
				if (response.new.length > 0) {
					results += '<br><div class="mdl-shadow--2dp details-title-block float-right"><h6 class="rtl float-right color-accent details-title-h6">سيارات جديدة</h6></div>';
					for (var i = 0; i < response.new.length; i++) {
						results += newTemp.replace(/{{brand}}/g, response.new[i].brand).replace(/{{model}}/g, response.new[i].model_id).replace(/{{cartitle}}/g, response.new[i].brand_name + ' ' + response.new[i].model_name).replace(/{{carcc}}/g, response.new[i].engine_capacity + ' سي سي').replace(/{{carprice}}/g, response.new[i].price + ' ج').replace(/{{carimage}}/g, response.new[i].images);
					}
				}
				if (response.used.length > 0) {
					results += '<br><div class="mdl-shadow--2dp details-title-block float-right"><h6 class="rtl float-right color-accent details-title-h6">سيارات مستعملة</h6></div>';
					for (var i = 0; i < response.used.length; i++) {
						results += usedTemp.replace(/{{id}}/g, response.used[i].id).replace(/{{cartitle}}/g, response.used[i].brand_name + ' ' + response.used[i].model_name).replace(/{{carcc}}/g, response.used[i].engine_capacity + ' سي سي').replace(/{{carprice}}/g, response.used[i].price + ' ج').replace(/{{carimage}}/g, response.used[i].images);
					}
				}
				$('#all-search-div-results').html(results);
			} else {
				$('#all-search-div-results').html('<div class="mdl-shadow--2dp rtl search-results-number">لم يتم العثور على نتائج بحث</div>');
			}
			$('#all-search-div').hide();
			$('#all-search-div-results').show();
			$('#loading').hide();
		}).fail(function() {
			$('#loading').hide();
			createSnackbar("حدث خطأ اثناء البحث برجاء المحاولة مرة آخرى", 'إغلاق');
		});
	});
}
function usedSelected(index) {
	if (index == -1) {
		$("#used-model").val('');
		usedID = -1;
	} else {
		var models = JSON.parse(window.localStorage.getItem('savedModels'));
		$("#used-model").val(models.selection[index]);
		usedID = parseInt(models.id[index]);
	}
	$('#used-suggestions').hide();
}
function newSelected(index) {
	if (index == -1) {
		$("#new-model").val('');
		newID = -1;
	} else {
		var models = JSON.parse(window.localStorage.getItem('savedModels'));
		$("#new-model").val(models.selection[index]);
		newID = parseInt(models.id[index]);
	}
	$('#new-suggestions').hide();
}
function allSelected(index) {
	if (index == -1) {
		$("#all-model").val('');
		allID = -1;
	} else {
		var models = JSON.parse(window.localStorage.getItem('savedModels'));
		$("#all-model").val(models.selection[index]);
		allID = parseInt(models.id[index]);
	}
	$('#all-suggestions').hide();
}