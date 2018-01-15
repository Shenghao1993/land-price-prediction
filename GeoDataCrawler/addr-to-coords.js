var cols = [];
var addrObjArr = [];
var addrArr = [];
var schoolDistArr = [];
var path = "http://localhost:63342/GeoDataCrawler/addr.csv";

// Read local address data
$.get(path, function (data) {
    $("p").empty();
	papaObj = Papa.parse(data);
	console.log(papaObj);
    addrObjArr = papaObj.data;
    addrArr = [];

    // Remove invalid address data
    for (var j = addrObjArr.length - 1; j >= 0; j--) {
        if (addrObjArr[j].indexOf("") == 0) {
            addrObjArr.splice(j, 1);
        }
    }
    console.log(addrObjArr.length);

	for (var i = 0; i < addrObjArr.length; i++) {
		var addrObj = addrObjArr[i];

        // if ((addrObj[2]).indexOf(addrObj[0]) >= 0) {
		 //    addrArr.push(addrObj[2]);
        // } else {
        //     addrArr.push(addrObj[0] + ' ' + addrObj[2]);
        // }
        // addrArr.push(addrObj[0] + ' ' + addrObj[1] + ' ' + addrObj[2]);
        // addrArr.push(addrObj[0] + ' ' + addrObj[2]);
        // addrArr.push(addrObj[0] + ' ' + addrObj[1]);
        addrArr.push(addrObj[0]);
	}
	
	for(var i = 0; i < addrArr.length; i++) {
		geocode(addrArr[i], i);
	}
});

var coords = [];
function initMap() {
	// var addr = '22 Main st Boston MA';
	// var coords = geocode(addr);

	for(var i = 0; i < addrArr.length; i++) {
		geocode(addrArr[i]);
	}
	// geocode(addr);
	// console.log(coords);
}

function geocode(location, index) {
	axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
		params: {
			address: location,
			key: 'AIzaSyCHKEv_ZsvjFamVFYAXlL8joL6h04dSDtg'
		}
	})
	.then(function(response) {
		// console.log(response);
		lat = response.data.results[0].geometry.location.lat;
		lng = response.data.results[0].geometry.location.lng;
		// coords.push(response.data.results[0].geometry.location);
		// coords = new google.maps.LatLng(lat, lng);
		$("p").append(index + ',' + lat + ',' + lng + '<br>');

	})
	.catch(function(error) {
		console.log(error);

		// Replace invalid address data with space
		$("p").append('<br>');
	})
}
