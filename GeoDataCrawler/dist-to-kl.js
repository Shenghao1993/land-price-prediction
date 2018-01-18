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
    var destinations = [];
    var origins = [];

    for (var i = 1; i < geoInfoObjArr.length; i++) {
    	// await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    	indices.push(geoInfoObjArr[i][0]);
    	destinations.push(dest);
    	origins.push(new google.maps.LatLng(geoInfoObjArr[i][2], geoInfoObjArr[i][3])); 
    }

    calDist(origins, destinations);

    function calDist(originArr, destArr) {
        var service = new google.maps.DistanceMatrixService;
    	service.getDistanceMatrix(
    	{
    		origins: originArr,
    		destinations: destArr,
    		travelMode: 'DRIVING',
    		unitSystem: google.maps.UnitSystem.METRIC,
    		avoidHighways: false,
    		avoidTolls: false
    	}, callback);
    }

    function callback(response, status) {
    	if (status == 'OK') {
    		var origins = response.originAddresses;
    		var destinations = response.destinationAddresses;

    		for (var i = 0; i < origins.length; i++) {
    			var results = response.rows[i].elements;
    			for (var j = 0; j < results.length; j++) {
    				var element = results[j];
    				var distance = element.distance.text;
    				var duration = element.duration.text;
    				console.log(indices[i]);
    				console.log(distance);
    				console.log(duration);
    				var from = origins[i];
    				var to = destinations[j];
    			}
    		}
    	}
    }
});