var map;
var path = "http://localhost:63342/GeoDataCrawler/coords.csv";

// https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
// https://developers.google.com/maps/documentation/javascript/distancematrix

// Read address data
$.get(path, function(data) {
	papaObj = Papa.parse(data);
    geoInfoObjArr = papaObj.data;

    var dest = 'Kuala Lumpur';
   	var indices = [];
    var origins = [];
    var latitude = '';
    var longtitude = '';
    var geocode = {};

    // for (var i = 1; i < geoInfoObjArr.length - 1; i++) {
    for (var i = 1; i < 10; i++) {
    	// await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    	indices.push(geoInfoObjArr[i][0]);
        latitude = parseFloat(geoInfoObjArr[i][2]);
        longtitude = parseFloat(geoInfoObjArr[i][3]);
        // geocode = {lat: latitude, lng: longtitude};
        geocode['lat'] = latitude;
        geocode['lng'] = longtitude;
        console.log(geocode);
        origins.push(geocode);
    }
    calDist(origins);

    function calDist(originObj) {
        var service = new google.maps.DistanceMatrixService();
        x = [{lat: 3.1449836, lng: 101.7594994}, {lat: 3.0479988, lng: 101.5989691}];
        console.log(x);
        console.log(originObj);
        service.getDistanceMatrix({
            origins: originObj,
            destinations: [dest],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        }, callback)
    }

    function callback(response, status) {
        console.log(response);
    	if (status == 'OK') {
    		var origins = response.originAddresses;
    		var destinations = response.destinationAddresses;

    		for (var i = 0; i < origins.length; i++) {
    			var results = response.rows[i].elements;
    			for (var j = 0; j < results.length; j++) {
    				var element = results[j];
    				var distance = element.distance.text;
    				var duration = element.duration.text;
    				console.log(indices[i] + ',' + distance + ',' + duration);
    				var from = origins[i];
    				var to = destinations[j];
    			}
    		}
    	}
    }
});